import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { chats, messages } from './schema';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Database connection
const dbPath = join(dataDir, 'db.sqlite');
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');

export const db = drizzle(sqlite, { 
  schema: { chats, messages }
});

export default db;
export { chats, messages };

// Helper function to close database connection
export const closeDatabase = () => {
  sqlite.close();
}; 