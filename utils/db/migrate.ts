import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';
import { join } from 'node:path';

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    
    const migrationsFolder = join(process.cwd(), 'drizzle');
    
    migrate(db, { migrationsFolder });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Helper functions for database operations
export const createTables = () => {
  // Tables are created automatically by Drizzle migrations
  console.log('Tables will be created by migration process');
};

export const dropTables = () => {
  console.warn('dropTables should only be used in development');
  // Implementation for development/testing purposes only
}; 