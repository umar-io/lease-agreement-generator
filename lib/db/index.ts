// lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Transaction pooler for serverless (Next.js API routes, Server Actions)
const client = postgres(process.env.DATABASE_URL_UNPOOLED!, {
  prepare: false,   // ← required for transaction pooler / Supabase
});

export const db = drizzle(client, { schema });