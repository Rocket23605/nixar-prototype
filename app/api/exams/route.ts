import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const exams = await prisma.examSet.findMany({
    where: { isPublished: true },
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(
    exams.map((e) => ({
      id: e.id,
      title: e.title,
      subject: e.subject,
      level: e.level,
      description: e.description,
      durationMins: e.durationMins,
      pdfUrl: e.pdfUrl,
      pdfFileName: e.pdfFileName,
      questionCount: e._count.questions,
      createdAt: e.createdAt,
    }))
  )
}
