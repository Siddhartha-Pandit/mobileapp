import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});

export const metrics = sqliteTable('metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: integer('value').notNull(),
  timestamp: integer('timestamp').notNull(),
  synced: integer('synced', { mode: 'boolean' }).default(false),
});
