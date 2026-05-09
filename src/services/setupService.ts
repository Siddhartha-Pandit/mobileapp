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

  async getUserSettings(userId: string) {
    try {
      const response = await api.get('/setup');
      if (response.ok) return await response.json();
    } catch (error) {
      console.warn('Backend fetch failed, trying local DB:', error);
    }

    const results = await db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, userId));
    return results[0] || null;
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
    // 1. Default User Settings
    const defaultSettings = {
      userId,
      theme: 'system',
      biometricLock: false,
      autoLockMinutes: 5,
      stealthMode: false,
      privateNotifications: false,
      maskTransactions: false,
      productImprovement: true,
      crashReporting: true,
      twoFactorAuth: false,
      preferredCurrency: 'NPR',
    };

    // 2. Default Cash Account
    const defaultAccount = {
      userId,
      name: 'Cash',
      type: 'Cash',
      initialBalance: 0,
      themeColor: '#0AA971', // Dhukuti Green
      includeInTotal: true,
    };

    // 3. Essential Categories (using Lucide icons)
    const essentialCategories = [
      { name: 'Food', icon: 'Utensils', themeColor: '#FF5722', isEssential: true },
      { name: 'Transport', icon: 'Bus', themeColor: '#2196F3', isEssential: true },
      { name: 'Utilities', icon: 'Zap', themeColor: '#FFEB3B', isEssential: true },
      { name: 'Health', icon: 'Activity', themeColor: '#E91E63', isEssential: true },
    ];

    // 4. Default Budget Goals (50/30/20 rule)
    const defaultBudgets = [
      { name: 'Needs', percentageAllocation: 50, color: '#2196F3', icon: 'Home', smartReminder: true },
      { name: 'Wants', percentageAllocation: 30, color: '#FF9800', icon: 'ShoppingCart', smartReminder: true },
      { name: 'Savings', percentageAllocation: 20, color: '#4CAF50', icon: 'TrendingUp', smartReminder: true },
    ];

    await this.saveUserSettings(defaultSettings);
    await this.createAccount(defaultAccount);
    await this.setupCategories(essentialCategories.map(c => ({ ...c, userId })));
    await this.setupBudgets(defaultBudgets.map(b => ({ ...b, userId })));
  }
};
