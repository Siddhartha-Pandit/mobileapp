import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  synced: integer('synced', { mode: 'boolean' }).default(false),
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
  autoLockMinutes: integer('auto_lock_minutes').default(5),
  hideBalance: integer('hide_balance', { mode: 'boolean' }).default(false),
  hideTransactionDetails: integer('hide_transaction_details', { mode: 'boolean' }).default(false),
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
