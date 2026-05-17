import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  synced: integer('synced', { mode: 'boolean' }).default(false),
  avatarUrl: text('avatar_url'),
  occupation: text('occupation'),
  gender: text('gender'),
  phone: text('phone'),
  language: text('language').default('en'),
});

export const metrics = sqliteTable('metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: integer('value').notNull(),
  timestamp: integer('timestamp').notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  theme: text('theme').default('system'),
  biometricLock: integer('biometric_lock', { mode: 'boolean' }).default(false),
  autoLockMinutes: integer('auto_lock_minutes').default(5),
  stealthMode: integer('stealth_mode', { mode: 'boolean' }).default(false),
  privateNotifications: integer('private_notifications', { mode: 'boolean' }).default(false),
  maskTransactions: integer('mask_transactions', { mode: 'boolean' }).default(false),
  productImprovement: integer('product_improvement', { mode: 'boolean' }).default(true),
  crashReporting: integer('crash_reporting', { mode: 'boolean' }).default(true),
  twoFactorAuth: integer('two_factor_auth', { mode: 'boolean' }).default(false),
  preferredCurrency: text('preferred_currency').default('NPR'),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  initialBalance: integer('initial_balance').notNull(),
  currentBalance: integer('current_balance').notNull(),
  themeColor: text('theme_color').notNull(),
  icon: text('icon'),
  includeInTotal: integer('include_in_total', { mode: 'boolean' }).default(true),
  notes: text('notes'),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  themeColor: text('theme_color').notNull(),
  isEssential: integer('is_essential', { mode: 'boolean' }).default(false),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const budgets = sqliteTable('budgets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  goalAmount: integer('goal_amount'),
  percentageAllocation: integer('percentage_allocation'),
  color: text('color').notNull(),
  icon: text('icon').notNull(),
  smartReminder: integer('smart_reminder', { mode: 'boolean' }).default(false),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(), // Server ID
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  unread: integer('unread', { mode: 'boolean' }).default(true),
  accentColor: text('accent_color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(true),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  accountId: text('account_id').notNull(),
  categoryId: text('category_id'),
  toAccountId: text('to_account_id'),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // 'income', 'expense', 'transfer'
  date: integer('date', { mode: 'timestamp' }).notNull(),
  description: text('description'),
  people: text('people'), // Stored as JSON string
  goalAllocation: text('goal_allocation'), // Stored as JSON string
  synced: integer('synced', { mode: 'boolean' }).default(false),
});
