import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface ChoiceInput {
  key: string
  value: string
}

interface QuestionInput {
  order: number
  category: string
  questionText: string
  imageUrl?: string
  correctAnswer: string
  explanation?: string
  choices: ChoiceInput[]
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, subject, level, description, durationMins, questions } = body

  if (!title || !subject || !level || !durationMins) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 })
  }

  const exam = await prisma.examSet.create({
    data: {
      title,
      subject,
      level,
      description,
      durationMins,
      questions: {
        create: (questions as QuestionInput[] | undefined)?.map((q) => ({
          order: q.order,
          category: q.category,
          questionText: q.questionText,
          imageUrl: q.imageUrl,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          choices: { create: q.choices },
        })),
      },
    },
    include: {
      _count: { select: { questions: true } },
    },
  })

  return NextResponse.json(exam, { status: 201 })
}

export async function GET() {
  const exams = await prisma.examSet.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(exams)
}
