import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expoDb = openDatabaseSync('dhukuti_app.db');

export const initializeDb = () => {
  expoDb.execSync(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, access_token TEXT, refresh_token TEXT, synced INTEGER DEFAULT 0, avatar_url TEXT, occupation TEXT, gender TEXT, phone TEXT, language TEXT DEFAULT "en"); ' +
    'CREATE TABLE IF NOT EXISTS metrics (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER NOT NULL, timestamp INTEGER NOT NULL, synced INTEGER DEFAULT 0);' +
    'CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, type TEXT NOT NULL, unread INTEGER DEFAULT 1, accent_color TEXT, created_at INTEGER NOT NULL, synced INTEGER DEFAULT 1);'
  );
};

export const db = drizzle(expoDb);
