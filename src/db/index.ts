import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Use DATABASE_URL (Neon) or POSTGRES_URL (Vercel Postgres)
export const db = drizzle(sql, { schema });
