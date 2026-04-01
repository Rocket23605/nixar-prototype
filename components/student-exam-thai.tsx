"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, FileText, X } from "lucide-react"
import { PdfViewer } from "@/components/pdf-viewer"

interface Choice {
  id: string
  key: string
  value: string
}

interface ExamQuestion {
  id: string
  order: number
  category: string
  questionText: string
  imageUrl: string | null
  choices: Choice[]
}

interface ExamData {
  id: string
  title: string
  durationMins: number
  pdfUrl: string | null
  questions: ExamQuestion[]
}

interface StudentExamThaiProps {
  examId: string
  onSubmit: (answers: Record<string, string>, examData: ExamData) => void
  onBack: () => void
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

export function StudentExamThai({ examId, onSubmit, onBack }: StudentExamThaiProps) {
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPdf, setShowPdf] = useState(false)

  useEffect(() => {
    fetch(`/api/exams/${examId}`)
      .then((r) => r.json())
      .then((data: ExamData) => {
        setExamData(data)
        setTimeLeft(data.durationMins * 60)
        setLoading(false)
      })
      .catch(() => {
        setFetchError("โหลดข้อสอบไม่สำเร็จ")
        setLoading(false)
      })
  }, [examId])

  useEffect(() => {
    if (!examData || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onSubmit(answers, examData)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examData, answers, onSubmit, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (fetchError || !examData) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-destructive">{fetchError || "ไม่พบข้อสอบ"}</p>
        <Button variant="outline" onClick={onBack}>กลับ</Button>
      </div>
    )
  }

  const question = examData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / examData.questions.length) * 100
  const answeredCount = Object.keys(answers).length

  const handleSubmit = () => {
    if (answeredCount < examData.questions.length) {
      setShowConfirm(true)
    } else {
      onSubmit(answers, examData)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-sm md:text-base">
                {examData.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                ข้อที่ {currentQuestion + 1} จาก {examData.questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {examData.pdfUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPdf((v) => !v)}
                className="text-xs hidden md:flex"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                {showPdf ? "ซ่อน PDF" : "ดูโจทย์ PDF"}
              </Button>
            )}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                timeLeft < 300 ? "bg-destructive/20 text-destructive" : "bg-secondary text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">

          {/* PDF Viewer Panel */}
          {showPdf && examData.pdfUrl && (
            <Card className="border-border/50 bg-card/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    เอกสารโจทย์ PDF
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowPdf(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <PdfViewer url={examData.pdfUrl} />
              </CardContent>
            </Card>
          )}

          {/* Mobile PDF button */}
          {examData.pdfUrl && (
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPdf((v) => !v)}
                className="w-full text-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                {showPdf ? "ซ่อน PDF โจทย์" : "ดูโจทย์ PDF"}
              </Button>
            </div>
          )}

          {/* Question Card */}
          <Card className="border-border/50 bg-card/50 mb-6">
            <CardContent className="p-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategoryColor(question.category)}`}
              >
                {question.category}
              </span>

              <h2 className="text-lg md:text-xl font-medium text-foreground mb-6">
                {question.order}. {question.questionText}
              </h2>

              {question.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.imageUrl}
                  alt="ภาพประกอบโจทย์"
                  className="max-w-full rounded-lg mb-4 border border-border"
                />
              )}

              <div className="space-y-3">
                {question.choices.map((choice) => (
                  <button
                    key={choice.key}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: choice.key }))
                    }
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      answers[question.id] === choice.key
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-border hover:border-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 ${
                          answers[question.id] === choice.key
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {choice.key}
                      </span>
                      <span className="text-foreground pt-1">{choice.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {examData.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? "bg-accent text-accent-foreground"
                    : answers[q.id]
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {q.order}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              ก่อนหน้า
            </Button>

            <div className="flex-1 max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                ตอบแล้ว {answeredCount}/{examData.questions.length} ข้อ
              </p>
            </div>

            {currentQuestion < examData.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                ถัดไป
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Send className="w-4 h-4 mr-1" />
                ส่งข้อสอบ
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    ยืนยันการส่งข้อสอบ
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    คุณยังตอบไม่ครบทุกข้อ ({answeredCount}/{examData.questions.length} ข้อ)
                    ต้องการส่งข้อสอบหรือไม่?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 border-border"
                >
                  กลับไปทำต่อ
                </Button>
                <Button
                  onClick={() => onSubmit(answers, examData)}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  ส่งข้อสอบ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export type { ExamData, ExamQuestion }
