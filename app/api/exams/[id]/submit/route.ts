import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface SubmitAnswer {
  questionId: string
  selectedKey: string | null
}

async function generateAiReport(
  examTitle: string,
  score: number,
  totalScore: number,
  wrongCategories: string[]
) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      summary: `คุณได้คะแนน ${score}/${totalScore} คะแนน`,
      strengths: ["ความพยายามในการทำข้อสอบ"],
      weaknesses: wrongCategories.length > 0 ? wrongCategories : ["ยังไม่มีข้อมูล"],
      suggestions: ["ทบทวนเนื้อหาและลองทำข้อสอบอีกครั้ง"],
    }
  }

  const prompt = `นักเรียนทำข้อสอบ "${examTitle}" ได้คะแนน ${score}/${totalScore}
หัวข้อที่ตอบผิด: ${wrongCategories.join(", ") || "ไม่มี"}

สรุปผลการสอบและให้คำแนะนำเป็นภาษาไทย โดยตอบในรูปแบบ JSON ดังนี้:
{
  "summary": "สรุปผลการสอบ 1-2 ประโยค",
  "strengths": ["จุดแข็ง 1", "จุดแข็ง 2"],
  "weaknesses": ["จุดที่ต้องพัฒนา 1"],
  "suggestions": ["คำแนะนำ 1", "คำแนะนำ 2"]
}`

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!res.ok) {
    return {
      summary: `คุณได้คะแนน ${score}/${totalScore} คะแนน`,
      strengths: ["ความพยายามในการทำข้อสอบ"],
      weaknesses: wrongCategories.length > 0 ? wrongCategories : ["ยังไม่มีข้อมูล"],
      suggestions: ["ทบทวนเนื้อหาและลองทำข้อสอบอีกครั้ง"],
    }
  }

  const data = await res.json()
  const text = data.content[0].text
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch {
    return null
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: examSetId } = await params
  const { userId, answers }: { userId: string; answers: SubmitAnswer[] } = await req.json()

  if (!userId || !answers) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 })
  }

  const exam = await prisma.examSet.findUnique({
    where: { id: examSetId },
    include: { questions: true },
  })

  if (!exam) {
    return NextResponse.json({ error: "ไม่พบชุดข้อสอบ" }, { status: 404 })
  }

  const correctMap = new Map(exam.questions.map((q) => [q.id, q.correctAnswer]))
  const categoryMap = new Map(exam.questions.map((q) => [q.id, q.category]))

  const scoredAnswers = answers.map((a) => ({
    questionId: a.questionId,
    selectedKey: a.selectedKey,
    isCorrect: a.selectedKey !== null && a.selectedKey === correctMap.get(a.questionId),
  }))

  const score = scoredAnswers.filter((a) => a.isCorrect).length
  const totalScore = exam.questions.length

  const wrongCategories = [
    ...new Set(
      scoredAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => categoryMap.get(a.questionId) ?? "")
        .filter(Boolean)
    ),
  ]

  const attempt = await prisma.examAttempt.create({
    data: {
      userId,
      examSetId,
      submittedAt: new Date(),
      score,
      totalScore,
      answers: {
        create: scoredAnswers,
      },
    },
  })

  const aiData = await generateAiReport(exam.title, score, totalScore, wrongCategories)

  const aiReport = await prisma.aiReport.create({
    data: {
      attemptId: attempt.id,
      summary: aiData?.summary ?? `คุณได้คะแนน ${score}/${totalScore} คะแนน`,
      strengths: aiData?.strengths ?? [],
      weaknesses: aiData?.weaknesses ?? wrongCategories,
      suggestions: aiData?.suggestions ?? [],
    },
  })

  const explanationMap = new Map(exam.questions.map((q) => [q.id, q.explanation]))

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    totalScore,
    aiReport: {
      summary: aiReport.summary,
      strengths: aiReport.strengths,
      weaknesses: aiReport.weaknesses,
      suggestions: aiReport.suggestions,
    },
    scoredAnswers: scoredAnswers.map((a) => ({
      questionId: a.questionId,
      selectedKey: a.selectedKey,
      isCorrect: a.isCorrect,
      correctAnswer: correctMap.get(a.questionId) ?? "",
      explanation: explanationMap.get(a.questionId) ?? null,
    })),
  })
}
