import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expoDb = openDatabaseSync('dhukuti_app.db');

export const initializeDb = () => {
  expoDb.execSync(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, synced INTEGER DEFAULT 0); ' +
    'CREATE TABLE IF NOT EXISTS metrics (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER NOT NULL, timestamp INTEGER NOT NULL, synced INTEGER DEFAULT 0);'
  );
};

export const db = drizzle(expoDb);
