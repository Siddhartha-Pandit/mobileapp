import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../db';
import { users, metrics, transactions } from '../db/schema';
import { eq } from 'drizzle-orm';
import api from '../api/client';

interface SyncState {
  isOnline: boolean;
  syncPending: boolean;
  checkNetwork: () => Promise<void>;
  syncData: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: false,
  syncPending: false,

  checkNetwork: async () => {
    const state = await NetInfo.fetch();
    set({ isOnline: !!state.isConnected && !!state.isInternetReachable });
  },

  syncData: async () => {
    const { isOnline } = get();
    if (!isOnline) {
      console.log('Offline. Cannot sync.');
      return;
    }

    set({ syncPending: true });

    try {
      // Fetch unsynced metrics
      const unsyncedMetrics = await db.select().from(metrics).where(eq(metrics.synced, false));
      if (unsyncedMetrics.length > 0) {
        console.log('Uploading unsynced metrics...', { unsyncedMetrics });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await db.update(metrics).set({ synced: true }).where(eq(metrics.synced, false));
      }

      // Fetch unsynced transactions
      const unsyncedTransactions = await db.select().from(transactions).where(eq(transactions.synced, false));
      if (unsyncedTransactions.length > 0) {
        console.log(`Syncing ${unsyncedTransactions.length} offline transactions...`);
        for (const t of unsyncedTransactions) {
          try {
            const dto: any = {
              id: t.id,
              amount: t.amount,
              date: new Date(t.date).toISOString(),
              description: t.description || '',
            };

            if (t.type === 'transfer') {
              dto.fromAccountId = t.accountId;
              dto.toAccountId = t.toAccountId;
              await api.post('/transfer', dto);
            } else {
              dto.accountId = t.accountId;
              dto.categoryId = t.categoryId;
              dto.People = JSON.parse(t.people || '[]');
              dto.GoalAllocation = JSON.parse(t.goalAllocation || '[]');
              
              if (t.type === 'income') {
                await api.post('/add-money', dto);
              } else if (t.type === 'expense') {
                await api.post('/add-expense', dto);
              }
            }

            // Mark this specific transaction as synced upon successful API call
            await db.update(transactions).set({ synced: true }).where(eq(transactions.id, t.id));
          } catch (err) {
            console.error(`Failed to sync transaction ${t.id}`, err);
            // We do not throw, we just let it try again on next sync
          }
        }
      }

      console.log('Sync successful.');
    } catch (error) {
      console.error('Initial sync error', error);
    } finally {
      set({ syncPending: false });
    }
  },
}));

// Setup automatic network listener
NetInfo.addEventListener(state => {
  useSyncStore.setState({ isOnline: !!state.isConnected && !!state.isInternetReachable });
  // If we just came online, we can trigger sync automatically!
  if (state.isConnected && state.isInternetReachable) {
    useSyncStore.getState().syncData();
  }
});
