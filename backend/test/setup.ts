import { DataSource } from 'typeorm';
import { User } from '../src/auth/auth.entity'; // Adjust to your structure

export const testDb = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'qqwwee11',
  database: process.env.POSTGRES_DB || 'testdb',
  entities: [User], // Add all your entities here
  synchronize: true, // Auto-sync schema for tests
});

export async function setupTestDb() {
  if (!testDb.isInitialized) {
    await testDb.initialize();
  }
  return testDb;
}

export async function teardownTestDb() {
  if (testDb.isInitialized) {
    await testDb.destroy();
  }
}
