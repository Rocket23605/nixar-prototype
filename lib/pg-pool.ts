import { Pool, type PoolConfig } from "pg"

/**
 * Prefer DIRECT_URL (Supabase session/direct, port 5432) over DATABASE_URL (pooler 6543)
 * to avoid Supavisor "Tenant or user not found" and Prisma/pg issues with the pooler.
 */
export function createPgPool(): Pool {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("Set DATABASE_URL or DIRECT_URL for the database connection.")
  }

  const config: PoolConfig = { connectionString }
  try {
    const host = new URL(connectionString.replace(/^postgresql:/i, "http:")).hostname
    if (host !== "localhost" && host !== "127.0.0.1") {
      config.ssl = { rejectUnauthorized: false }
    }
  } catch {
    config.ssl = { rejectUnauthorized: false }
  }

  return new Pool(config)
}
