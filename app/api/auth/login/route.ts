import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 })
  }

  let user
  try {
    user = await prisma.user.findUnique({ where: { username } })
  } catch (err) {
    console.error("[login] prisma error:", err)
    return NextResponse.json({ error: "DB error: " + (err as Error).message }, { status: 500 })
  }

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role.toLowerCase(),
  })
}
