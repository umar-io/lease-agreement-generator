import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema"; // 1. Import your entire schema

const connectionString = process.env.DATABASE_URL!;

// 2. Disable prefetch for Neon/Serverless environments if using postgres.js
const client = postgres(connectionString);

// 3. Pass the schema as the second argument
export const db = drizzle(client, { schema });