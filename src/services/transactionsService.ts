import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import * as schema from '../db/schema';
import api from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

interface TransactionInput {
  accountId: string;
  categoryId?: string;
  toAccountId?: string;
  amount: number;
  date?: string | Date;
  description: string;
  People?: { personId: string; Amount: number }[];
  GoalAllocation?: { goalId: string; Amount: number }[];
}

export const transactionsService = {
  async addMoney(input: TransactionInput) {
    const userId = useAuthStore.getState().user?.id || 'unknown';
    const id = uuidv4();
    const date = input.date ? new Date(input.date) : new Date();

    // 1. Save to local DB (synced: false)
    await db.insert(schema.transactions).values({
      id,
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId || '',
      amount: input.amount,
      type: 'income',
      date,
      description: input.description,
      people: JSON.stringify(input.People || []),
      goalAllocation: JSON.stringify(input.GoalAllocation || []),
      synced: false,
    });

    // 2. Try to sync immediately
    try {
      await api.post('/add-money', { ...input, id, date: date.toISOString() });
      // If success, mark synced
      await db.update(schema.transactions)
        .set({ synced: true })
        .where(schema.transactions.id.equals(id));
    } catch (error) {
      console.warn('Sync failed for addMoney, will retry later via useSyncStore');
    }

    return id;
  },

  async addExpense(input: TransactionInput) {
    const userId = useAuthStore.getState().user?.id || 'unknown';
    const id = uuidv4();
    const date = input.date ? new Date(input.date) : new Date();

    await db.insert(schema.transactions).values({
      id,
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId || '',
      amount: input.amount,
      type: 'expense',
      date,
      description: input.description,
      people: JSON.stringify(input.People || []),
      goalAllocation: JSON.stringify(input.GoalAllocation || []),
      synced: false,
    });

    try {
      await api.post('/add-expense', { ...input, id, date: date.toISOString() });
      await db.update(schema.transactions)
        .set({ synced: true })
        .where(schema.transactions.id.equals(id));
    } catch (error) {
      console.warn('Sync failed for addExpense, will retry later via useSyncStore');
    }

    return id;
  },

  async createTransfer(input: Omit<TransactionInput, 'categoryId' | 'People' | 'GoalAllocation'> & { toAccountId: string; fromAccountId: string }) {
    const userId = useAuthStore.getState().user?.id || 'unknown';
    const id = uuidv4();
    const date = input.date ? new Date(input.date) : new Date();

    await db.insert(schema.transactions).values({
      id,
      userId,
      accountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      amount: input.amount,
      type: 'transfer',
      date,
      description: input.description,
      synced: false,
    });

    try {
      await api.post('/transfer', { ...input, id, date: date.toISOString() });
      await db.update(schema.transactions)
        .set({ synced: true })
        .where(schema.transactions.id.equals(id));
    } catch (error) {
      console.warn('Sync failed for createTransfer, will retry later via useSyncStore');
    }

    return id;
  }
};
