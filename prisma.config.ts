import { resolve } from "node:path"
import { defineConfig } from "prisma/config"
import * as dotenv from "dotenv"

dotenv.config({ path: resolve(process.cwd(), ".env") })
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true })

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!dbUrl) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in .env / .env.local")
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
})
