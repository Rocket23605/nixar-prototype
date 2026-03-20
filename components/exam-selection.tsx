"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react"

interface ExamSet {
  id: string
  title: string
  questionCount: number
  duration: string
  status: "not_started" | "completed"
  score?: number
}

interface ExamSelectionProps {
  studentName: string
  onSelectExam: (examId: string) => void
}

const EXAM_SETS: ExamSet[] = [
  {
    id: "exam1",
    title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 1",
    questionCount: 5,
    duration: "45 นาที",
    status: "completed",
    score: 60,
  },
  {
    id: "exam2",
    title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 2",
    questionCount: 5,
    duration: "45 นาที",
    status: "not_started",
  },
  {
    id: "exam3",
    title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 3",
    questionCount: 5,
    duration: "45 นาที",
    status: "not_started",
  },
]

export function ExamSelection({ studentName, onSelectExam }: ExamSelectionProps) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            สวัสดี {studentName}!
          </h1>
          <p className="text-muted-foreground">
            เลือกชุดข้อสอบที่ต้องการทำ
          </p>
        </div>
        {/* Tips */}
        <Card className="mt-8 border-accent/30 bg-accent/5">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span>
              เคล็ดลับการทำข้อสอบ
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• อ่านโจทย์ให้ครบถ้วนก่อนตอบ</li>
              <li>• บริหารเวลาให้ดี แบ่งเวลาต่อข้อ</li>
              <li>• หลังส่งข้อสอบ AI จะวิเคราะห์จุดอ่อน-จุดแข็งให้ทันที</li>
            </ul>
          </CardContent>
        </Card>

        {/* Exam List */}
        <div className="space-y-4">
          {EXAM_SETS.map((exam) => (
            <Card
              key={exam.id}
              className="border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-200 group"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      exam.status === "completed"
                        ? "bg-success/20"
                        : "bg-accent/20"
                    }`}
                  >
                    {exam.status === "completed" ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <FileText className="w-6 h-6 text-accent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {exam.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {exam.questionCount} ข้อ
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {exam.duration}
                      </span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    {exam.status === "completed" ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                          ทำแล้ว ({exam.score}%)
                        </span>
                      </div>
                    ) : (
                      <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                        ยังไม่ทำ
                      </span>
                    )}
                    <Button
                      onClick={() => onSelectExam(exam.id)}
                      variant={exam.status === "completed" ? "outline" : "default"}
                      className={
                        exam.status === "completed"
                          ? "border-border hover:bg-secondary"
                          : "bg-accent hover:bg-accent/90 text-accent-foreground"
                      }
                    >
                      {exam.status === "completed" ? "ทำอีกครั้ง" : "เริ่มทำข้อสอบ"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
