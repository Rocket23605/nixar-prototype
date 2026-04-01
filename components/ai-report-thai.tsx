"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import type { ExamData } from "./student-exam-thai"
import type { SubmitResult } from "./ai-processing-thai"

interface AIReportThaiProps {
  examData: ExamData
  answers: Record<string, string>
  submitResult: SubmitResult
  onRetake: () => void
  onBackToSelection: () => void
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    แคลคูลัส: "bg-chart-1/20 text-chart-1",
    พีชคณิต: "bg-chart-2/20 text-chart-2",
    ตรีโกณมิติ: "bg-chart-3/20 text-chart-3",
    สถิติ: "bg-chart-4/20 text-chart-4",
    ลอการิทึม: "bg-chart-5/20 text-chart-5",
  }
  return map[category] ?? "bg-secondary text-muted-foreground"
}

export function AIReportThai({
  examData,
  answers,
  submitResult,
  onRetake,
  onBackToSelection,
}: AIReportThaiProps) {
  const { score, totalScore, aiReport, scoredAnswers } = submitResult
  const scorePercentage = Math.round((score / totalScore) * 100)

  const correctMap = new Map(
    scoredAnswers.map((a) => [a.questionId, { isCorrect: a.isCorrect, correctAnswer: a.correctAnswer, explanation: a.explanation }])
  )

  const getLevel = (s: number) => {
    if (s >= 80) return { text: "ดีมาก", color: "text-success", bg: "bg-success/20" }
    if (s >= 60) return { text: "ดี", color: "text-chart-2", bg: "bg-chart-2/20" }
    if (s >= 40) return { text: "ปานกลาง", color: "text-warning", bg: "bg-warning/20" }
    return { text: "ต้องปรับปรุง", color: "text-destructive", bg: "bg-destructive/20" }
  }

  const level = getLevel(scorePercentage)
  const AVERAGE_SCORE = 52
  const diffFromAverage = scorePercentage - AVERAGE_SCORE
  const isAboveAverage = diffFromAverage >= 0

  // Calculate per-category stats
  const topicScores: Record<string, { correct: number; total: number }> = {}
  examData.questions.forEach((q) => {
    if (!topicScores[q.category]) topicScores[q.category] = { correct: 0, total: 0 }
    topicScores[q.category].total++
    if (correctMap.get(q.id)?.isCorrect) topicScores[q.category].correct++
  })

  const categories = Object.keys(topicScores)

  const barChartData = categories.map((cat) => {
    const data = topicScores[cat]
    const wrong = data.total - data.correct
    return { topic: cat, correct: data.correct, wrong: -wrong }
  })

  const maxBarValue = Math.max(
    ...barChartData.flatMap((d) => [d.correct, Math.abs(d.wrong)]),
    1
  )

  const weakestTopic = barChartData.reduce((prev, cur) =>
    Math.abs(prev.wrong) >= Math.abs(cur.wrong) ? prev : cur
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            รายงานผลการวิเคราะห์ AI
          </h1>
          <p className="text-muted-foreground">
            ระบบ AI ได้วิเคราะห์ผลสอบของคุณเรียบร้อยแล้ว
          </p>
        </div>

        {/* Section 1: Score Summary */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-accent" />
              ส่วนที่ 1: สรุปคะแนน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-secondary" />
                  <circle
                    cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - scorePercentage / 100)}
                    strokeLinecap="round"
                    className="text-accent transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{scorePercentage}%</span>
                  <span className="text-sm text-muted-foreground">{score}/{totalScore} ข้อ</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">ระดับ:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.bg} ${level.color}`}>
                    {level.text}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">เปรียบเทียบกับค่าเฉลี่ย:</span>
                  {isAboveAverage ? (
                    <span className="flex items-center gap-1 text-success">
                      <TrendingUp className="w-4 h-4" />
                      สูงกว่าค่าเฉลี่ย {diffFromAverage}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive">
                      <TrendingDown className="w-4 h-4" />
                      น้อยกว่าค่าเฉลี่ย {Math.abs(diffFromAverage)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  ค่าเฉลี่ยของผู้สอบทั้งหมด: {AVERAGE_SCORE}%
                </p>
                {aiReport.summary && (
                  <p className="text-sm text-foreground bg-secondary/50 rounded-lg p-3">
                    {aiReport.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Bar Chart */}
            {barChartData.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-4">สรุปผลแยกตามบทเรียน</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="topic" stroke="var(--foreground)" tick={{ fill: "var(--foreground)", fontSize: 12 }} tickLine={{ stroke: "var(--foreground)" }} />
                      <YAxis domain={[-maxBarValue, maxBarValue]} stroke="var(--foreground)" tick={{ fill: "var(--foreground)", fontSize: 12 }} tickLine={{ stroke: "var(--foreground)" }} tickFormatter={(v) => (v < 0 ? Math.abs(v).toString() : v.toString())} />
                      <ReferenceLine y={0} stroke="var(--foreground)" strokeWidth={1} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                        labelStyle={{ color: "var(--foreground)" }}
                        itemStyle={{ color: "var(--foreground)" }}
                        formatter={(value: number, name: string) => [name === "correct" ? value : Math.abs(value), name === "correct" ? "ข้อถูก" : "ข้อผิด"]}
                      />
                      <Legend formatter={(v) => (v === "correct" ? "ข้อถูก" : "ข้อผิด")} wrapperStyle={{ color: "var(--foreground)" }} />
                      <Bar dataKey="correct" name="correct" fill="var(--success)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="wrong" name="wrong" fill="var(--destructive)" radius={[0, 0, 4, 4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Answer Review */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="w-5 h-5 text-accent" />
              ส่วนที่ 2: เฉลยทุกข้อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examData.questions.map((q) => {
              const scored = correctMap.get(q.id)
              const isCorrect = scored?.isCorrect ?? false
              const studentKey = answers[q.id] || "-"
              const studentAnswerText = q.choices.find((c) => c.key === studentKey)?.value || "ไม่ได้ตอบ"
              const correctKey = scored?.correctAnswer ?? ""
              const correctAnswerText = q.choices.find((c) => c.key === correctKey)?.value

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCorrect ? "bg-success/20" : "bg-destructive/20"}`}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(q.category)}`}>{q.category}</span>
                        <span className="text-xs text-muted-foreground">ข้อที่ {q.order}</span>
                      </div>
                      <p className="text-foreground font-medium mb-3">{q.questionText}</p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">คำตอบของคุณ:</span>
                          <span className={isCorrect ? "text-success" : "text-destructive"}>
                            {studentKey}. {studentAnswerText}
                          </span>
                        </div>
                        {!isCorrect && correctKey && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">เฉลย:</span>
                            <span className="text-success">{correctKey}. {correctAnswerText}</span>
                          </div>
                        )}
                      </div>
                      {scored?.explanation && (
                        <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">คำอธิบาย:</strong> {scored.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Section 3: AI Learning Path */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-accent" />
                ส่วนที่ 3: แผนการเรียนส่วนตัวจาก AI
              </CardTitle>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">AI</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-6">
              <p className="text-foreground">
                <span className="text-accent font-semibold">AI แนะนำ:</span>{" "}
                แนะนำให้ฝึกเรื่อง <strong>{weakestTopic.topic}</strong> อย่างน้อย 3 วัน ก่อนสอบจริง
              </p>
            </div>

            {aiReport.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">จุดแข็ง:</h4>
                <ul className="space-y-1">
                  {aiReport.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiReport.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">คำแนะนำจาก AI:</h4>
                <div className="space-y-3">
                  {aiReport.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                ฝึกโจทย์จุดอ่อนทันที
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={onRetake} className="flex-1 border-border">
                <RotateCcw className="w-4 h-4 mr-2" />
                ทำข้อสอบอีกครั้ง
              </Button>
              <Button variant="outline" onClick={onBackToSelection} className="flex-1 border-border">
                กลับหน้าเลือกข้อสอบ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
