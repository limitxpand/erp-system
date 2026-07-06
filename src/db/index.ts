import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_G9RPJKar3Euh@ep-raspy-frost-at71gpjo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
export const db = drizzle(sql);
