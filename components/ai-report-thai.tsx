"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { QUESTIONS } from "./student-exam-thai"

interface AIReportThaiProps {
  answers: Record<number, string>
  onRetake: () => void
  onBackToSelection: () => void
}

const TOPIC_DATA = [
  { topic: "แคลคูลัส", fullMark: 100 },
  { topic: "พีชคณิต", fullMark: 100 },
  { topic: "ตรีโกณมิติ", fullMark: 100 },
  { topic: "สถิติ", fullMark: 100 },
]

// คำอธิบายเฉลย (ใช้ทั้งข้อที่ตอบถูกและผิด)
const EXPLANATIONS: Record<number, string> = {
  1: "ใช้สูตร d/dx(xⁿ) = nxⁿ⁻¹ ดังนั้น d/dx(3x³) = 9x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0",
  2: "ใช้สูตร ∫xⁿdx = xⁿ⁺¹/(n+1) + C ดังนั้น ∫2xdx = x² และ ∫3dx = 3x รวมกันได้ x² + 3x + C",
  3: "แยกตัวประกอบ x² - 5x + 6 = (x-2)(x-3) = 0 ดังนั้น x = 2 หรือ x = 3",
  4: "ตามอัตลักษณ์ตรีโกณมิติพื้นฐาน sin²θ + cos²θ = 1 เสมอ ไม่ว่ามุม θ จะเป็นเท่าใด",
  5: "ค่าเฉลี่ยเลขคณิต = ผลรวม/จำนวนข้อมูล = (2+4+6+8+10)/5 = 30/5 = 6",
}

// การวิเคราะห์ว่าทำไมนักเรียนถึงเลือกตัวเลือกผิด (สำหรับข้อที่ตอบผิดเท่านั้น)
const WRONG_ANSWER_ANALYSIS: Record<number, Record<string, string>> = {
  1: {
    B: "อาจสับสนระหว่างอนุพันธ์ของ 2x² — ใช้สูตรผิดเป็น 2x แทน 4x",
    C: "อาจลืมคูณสัมประสิทธิ์กับเลขชี้กำลัง หรือใช้สูตรอนุพันธ์ไม่ครบทุกเทอม",
    D: "อาจสับสนเครื่องหมายของอนุพันธ์ของ -5x ได้เป็น +5 แทน -5",
  },
  2: {
    B: "อาจลืมหารสัมประสิทธิ์ 2 เมื่ออินทิเกรต 2x หรือคิดว่า ∫2x dx = 2x²/2 + C",
    C: "อาจลืมอินทิเกรตเทอม 3 — ∫3 dx = 3x ไม่ใช่แค่ 3",
    D: "อาจคิดว่าอินทิเกรตคือการคงรูปเดิม หรือสับสนระหว่างอนุพันธ์กับปริพันธ์",
  },
  3: {
    A: "อาจสับสนการแยกตัวประกอบ — คิดว่า 1×6=6 แต่ลืมว่า 1+6≠5 หรือแยกตัวประกอบผิด",
    C: "อาจสับสนเครื่องหมาย — คิดว่าต้องได้จำนวนลบ หรือแยก (x+2)(x+3) แทน (x-2)(x-3)",
    D: "อาจใช้สูตรผิดหรือทดลองแทนค่า x ผิด ทำให้ได้คำตอบที่ไม่ตรงกับสมการ",
  },
  4: {
    A: "อาจคิดว่า sin และ cos หักล้างกันได้เป็น 0 หรือสับสนกับ sin(0°) + cos(0°)",
    B: "อาจคิดว่า sin(45°)=cos(45°)=√2/2 แล้วบวกกันได้ 0.5 หรือคำนวณผิด",
    D: "อาจคิดว่า sin²+cos² = (sin+cos)² หรือคำนวณค่า sin(45°)+cos(45°) แล้วยกกำลังสอง",
  },
  5: {
    A: "อาจคำนวณผิดหรือใช้สูตรผิด เช่น หารด้วย 4 แทน 5",
    C: "อาจบวกเลขผิดหรือนับจำนวนข้อมูลผิด",
    D: "อาจใช้ค่ากลางอื่น เช่น มัธยฐาน หรือคิดว่าค่าเฉลี่ยคือค่าสูงสุด",
  },
}

const LEARNING_PATH = [
  {
    topic: "แคลคูลัส - อนุพันธ์และปริพันธ์",
    difficulty: "ปานกลาง",
    difficultyColor: "bg-warning/20 text-warning",
    reason: "คุณเสียคะแนนในหมวดนี้มากที่สุด",
  },
  {
    topic: "พีชคณิต - สมการกำลังสอง",
    difficulty: "ง่าย",
    difficultyColor: "bg-success/20 text-success",
    reason: "ทบทวนพื้นฐานเพิ่มความมั่นใจ",
  },
  {
    topic: "ตรีโกณมิติ - อัตลักษณ์พื้นฐาน",
    difficulty: "ปานกลาง",
    difficultyColor: "bg-warning/20 text-warning",
    reason: "เสริมความเข้าใจสูตรสำคัญ",
  },
]

export function AIReportThai({ answers, onRetake, onBackToSelection }: AIReportThaiProps) {
  // Calculate score
  const correctAnswers = QUESTIONS.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length
  const totalQuestions = QUESTIONS.length
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Determine level
  const getLevel = (score: number) => {
    if (score >= 80) return { text: "ดีมาก", color: "text-success", bg: "bg-success/20" }
    if (score >= 60) return { text: "ดี", color: "text-chart-2", bg: "bg-chart-2/20" }
    if (score >= 40) return { text: "ปานกลาง", color: "text-warning", bg: "bg-warning/20" }
    return { text: "ต้องปรับปรุง", color: "text-destructive", bg: "bg-destructive/20" }
  }

  const level = getLevel(scorePercentage)

  // Calculate topic scores
  const topicScores: Record<string, { correct: number; total: number }> = {}
  QUESTIONS.forEach((q) => {
    if (!topicScores[q.category]) {
      topicScores[q.category] = { correct: 0, total: 0 }
    }
    topicScores[q.category].total++
    if (answers[q.id] === q.correctAnswer) {
      topicScores[q.category].correct++
    }
  })

  // Radar chart data
  const radarData = TOPIC_DATA.map((t) => ({
    topic: t.topic,
    score: topicScores[t.topic]
      ? Math.round((topicScores[t.topic].correct / topicScores[t.topic].total) * 100)
      : 0,
    fullMark: t.fullMark,
  }))

  // Find weakest topic
  const weakestTopic = radarData.reduce((prev, current) =>
    prev.score < current.score ? prev : current
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
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-secondary"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - scorePercentage / 100)}
                    strokeLinecap="round"
                    className="text-accent transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{scorePercentage}%</span>
                  <span className="text-sm text-muted-foreground">
                    {correctAnswers}/{totalQuestions} ข้อ
                  </span>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">ระดับ:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.bg} ${level.color}`}>
                    {level.text}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">เปรียบเทียบกับค่าเฉลี่ย:</span>
                  <span className="flex items-center gap-1 text-success">
                    <TrendingUp className="w-4 h-4" />
                    สูงกว่าค่าเฉลี่ย 8%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ค่าเฉลี่ยของผู้สอบทั้งหมด: 52%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Topic Analysis with Radar Chart */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-accent" />
              ส่วนที่ 2: วิเคราะห์จุดอ่อน-จุดแข็ง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Radar Chart */}
              <div className="w-full lg:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="topic"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    />
                    <Radar
                      name="คะแนน"
                      dataKey="score"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Topic Bars */}
              <div className="flex-1 space-y-4">
                {radarData.map((topic) => (
                  <div key={topic.topic}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{topic.topic}</span>
                      <span className="text-sm text-muted-foreground">{topic.score}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.score >= 60 ? "bg-success" : topic.score >= 40 ? "bg-warning" : "bg-destructive"
                        }`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Weakness Alert */}
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        จุดอ่อน: {weakestTopic.topic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        คุณเสียคะแนนหมวดนี้มากที่สุด — แนะนำให้เน้นทบทวน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Answer Review */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="w-5 h-5 text-accent" />
              ส่วนที่ 3: เฉลยทุกข้อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUESTIONS.map((q) => {
              const isCorrect = answers[q.id] === q.correctAnswer
              const studentAnswer = answers[q.id] || "-"
              const studentAnswerText = q.options.find((o) => o.key === studentAnswer)?.value || "ไม่ได้ตอบ"
              const correctAnswerText = q.options.find((o) => o.key === q.correctAnswer)?.value

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCorrect ? "bg-success/20" : "bg-destructive/20"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${q.categoryColor}`}>
                          {q.category}
                        </span>
                        <span className="text-xs text-muted-foreground">ข้อที่ {q.id}</span>
                      </div>
                      <p className="text-foreground font-medium mb-3">{q.question}</p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">คำตอบของคุณ:</span>
                          <span className={isCorrect ? "text-success" : "text-destructive"}>
                            {studentAnswer}. {studentAnswerText}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">เฉลย:</span>
                            <span className="text-success">
                              {q.correctAnswer}. {correctAnswerText}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* คำอธิบาย - แสดงทั้งข้อที่ตอบถูกและผิด */}
                      {EXPLANATIONS[q.id] && (
                        <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">คำอธิบาย:</strong>{" "}
                            {EXPLANATIONS[q.id]}
                          </p>
                        </div>
                      )}
                      {/* การวิเคราะห์ - เฉพาะข้อที่ตอบผิด */}
                      {!isCorrect && studentAnswer !== "-" && WRONG_ANSWER_ANALYSIS[q.id]?.[studentAnswer] && (
                        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">การวิเคราะห์:</strong>{" "}
                            {WRONG_ANSWER_ANALYSIS[q.id][studentAnswer]}
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

        {/* Section 4: Learning Path */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-accent" />
              ส่วนที่ 4: แผนการเรียนส่วนตัวจาก AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-6">
              <p className="text-foreground">
                <span className="text-accent font-semibold">AI แนะนำ:</span>{" "}
                แนะนำให้ฝึกเรื่อง{weakestTopic.topic} อย่างน้อย 3 วัน ก่อนสอบจริง
                เพื่อเพิ่มคะแนนในหมวดที่คุณอ่อนที่สุด
              </p>
            </div>

            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              หัวข้อที่แนะนำให้ฝึกต่อ:
            </h4>
            <div className="space-y-3">
              {LEARNING_PATH.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-semibold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.topic}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.difficultyColor}`}>
                    {item.difficulty}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                ฝึกโจทย์จุดอ่อนทันที
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={onRetake}
                className="flex-1 border-border"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                ทำข้อสอบอีกครั้ง
              </Button>
              <Button
                variant="outline"
                onClick={onBackToSelection}
                className="flex-1 border-border"
              >
                กลับหน้าเลือกข้อสอบ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
