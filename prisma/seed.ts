import { resolve } from "node:path"
import * as dotenv from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { createPgPool } from "../lib/pg-pool"

dotenv.config({ path: resolve(process.cwd(), ".env") })
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true })

const EXAM_ID = "452024b7-731f-49f1-881d-6ab71b757c3b"

async function main() {
  const pool = createPgPool()
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

  try {
    await prisma.user.upsert({
      where: { username: "admin" },
      create: {
        email: "admin@nixar.local",
        username: "admin",
        password: "admin1234",
        displayName: "ผู้ดูแลระบบ",
        role: "ADMIN",
      },
      update: {
        password: "admin1234",
        displayName: "ผู้ดูแลระบบ",
        role: "ADMIN",
      },
    })

    await prisma.user.upsert({
      where: { username: "student01" },
      create: {
        email: "student01@nixar.local",
        username: "student01",
        password: "student1234",
        displayName: "น้องทดสอบ",
        role: "STUDENT",
      },
      update: {
        password: "student1234",
        displayName: "น้องทดสอบ",
        role: "STUDENT",
      },
    })

    await prisma.examSet.upsert({
      where: { id: EXAM_ID },
      create: {
        id: EXAM_ID,
        title: "ชุดทดสอบ PAT1 คณิตศาสตร์",
        subject: "คณิตศาสตร์",
        level: "PAT1",
        description: "ชุดทดสอบตาม TEST_PLAN",
        durationMins: 90,
        isPublished: true,
      },
      update: {
        title: "ชุดทดสอบ PAT1 คณิตศาสตร์",
        durationMins: 90,
        isPublished: true,
      },
    })
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
