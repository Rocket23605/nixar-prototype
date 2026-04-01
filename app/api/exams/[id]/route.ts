import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const exam = await prisma.examSet.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          choices: { orderBy: { key: "asc" } },
        },
      },
    },
  })

  if (!exam) {
    return NextResponse.json({ error: "ไม่พบชุดข้อสอบ" }, { status: 404 })
  }

  return NextResponse.json({
    id: exam.id,
    title: exam.title,
    subject: exam.subject,
    level: exam.level,
    description: exam.description,
    durationMins: exam.durationMins,
    pdfUrl: exam.pdfUrl,
    pdfFileName: exam.pdfFileName,
    questions: exam.questions.map((q) => ({
      id: q.id,
      order: q.order,
      category: q.category,
      questionText: q.questionText,
      imageUrl: q.imageUrl,
      choices: q.choices.map((c) => ({ id: c.id, key: c.key, value: c.value })),
    })),
  })
}
