// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL

// Singleton pattern for Next.js
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Prisma 7 often requires explicit log levels to debug connection issues
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma