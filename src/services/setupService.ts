import { db } from '../db';
import * as schema from '../db/schema';
import api from '../api/client';
import { eq } from 'drizzle-orm';

export const setupService = {
  async saveUserSettings(settings: any) {
    // 1. Save to local DB
    await db.insert(schema.userSettings).values({
      ...settings,
      synced: false,
    });

    // 2. Try to sync with backend
    try {
      await api.post('/setup', settings);
      // Mark as synced if successful
      // (Implementation depends on how we handle updates in local DB)
    } catch (error) {
      console.warn('Sync failed, will retry later:', error);
    }
  },

  async createAccount(account: any) {
    await db.insert(schema.accounts).values({
      ...account,
      currentBalance: account.initialBalance,
      synced: false,
    });

    try {
      await api.post('/accounts', account);
    } catch (error) {
      console.warn('Sync failed, will retry later:', error);
    }
  },

  async setupCategories(categories: any[]) {
    for (const category of categories) {
      await db.insert(schema.categories).values({
        ...category,
        synced: false,
      });
    }

    try {
      await api.post('/categories', categories);
    } catch (error) {
      console.warn('Sync failed, will retry later:', error);
    }
  },

  async setupBudgets(budgets: any[]) {
    for (const budget of budgets) {
      await db.insert(schema.budgets).values({
        ...budget,
        synced: false,
      });
    }

    try {
      await api.post('/budgets', budgets);
    } catch (error) {
      console.warn('Sync failed, will retry later:', error);
    }
  },

  async skipSetup(userId: string) {
    // Default values
    const defaultCurrency = 'NPR';
    const defaultAccount = {
      userId,
      name: 'Cash',
      type: 'Cash',
      initialBalance: 0,
      themeColor: '#4CAF50', // Green
      includeInTotal: true,
    };
    const essentialCategories = [
      { name: 'Food', icon: 'fast-food', themeColor: '#FF5722', isEssential: true },
      { name: 'Transport', icon: 'bus', themeColor: '#2196F3', isEssential: true },
      { name: 'Utilities', icon: 'flash', themeColor: '#FFEB3B', isEssential: true },
      { name: 'Health', icon: 'medical', themeColor: '#E91E63', isEssential: true },
    ];
    const defaultBudgets = [
      { name: 'Needs', percentageAllocation: 50, color: '#2196F3', icon: 'home', smartReminder: true },
      { name: 'Wants', percentageAllocation: 30, color: '#FF9800', icon: 'cart', smartReminder: true },
      { name: 'Savings', percentageAllocation: 20, color: '#4CAF50', icon: 'trending-up', smartReminder: true },
    ];

    await this.saveUserSettings({ userId, preferredCurrency: defaultCurrency });
    await this.createAccount(defaultAccount);
    await this.setupCategories(essentialCategories.map(c => ({ ...c, userId })));
    await this.setupBudgets(defaultBudgets.map(b => ({ ...b, userId })));
  }
};
