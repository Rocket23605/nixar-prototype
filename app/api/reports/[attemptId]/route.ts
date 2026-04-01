import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params

  const report = await prisma.aiReport.findUnique({
    where: { attemptId },
    include: {
      attempt: {
        include: {
          examSet: { select: { title: true, subject: true, level: true } },
          answers: {
            include: {
              question: { select: { order: true, category: true, correctAnswer: true } },
            },
          },
        },
      },
    },
  })

  if (!report) {
    return NextResponse.json({ error: "ไม่พบรายงาน" }, { status: 404 })
  }

  return NextResponse.json({
    id: report.id,
    attemptId: report.attemptId,
    summary: report.summary,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    suggestions: report.suggestions,
    createdAt: report.createdAt,
    attempt: {
      score: report.attempt.score,
      totalScore: report.attempt.totalScore,
      startedAt: report.attempt.startedAt,
      submittedAt: report.attempt.submittedAt,
      examSet: report.attempt.examSet,
      answers: report.attempt.answers.map((a) => ({
        questionOrder: a.question.order,
        category: a.question.category,
        selectedKey: a.selectedKey,
        correctAnswer: a.question.correctAnswer,
        isCorrect: a.isCorrect,
      })),
    },
  })
}
