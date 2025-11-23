import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use DATABASE_URL or POSTGRES_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL!;

// Create postgres client with connection pooling
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

export const db = drizzle(client, { schema });
