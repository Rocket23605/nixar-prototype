"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, Clock, ChevronRight, Loader2 } from "lucide-react"

interface ExamSet {
  id: string
  title: string
  questionCount: number
  durationMins: number
  pdfUrl: string | null
}

interface ExamSelectionProps {
  studentName: string
  onSelectExam: (examId: string) => void
}

export function ExamSelection({ studentName, onSelectExam }: ExamSelectionProps) {
  const [exams, setExams] = useState<ExamSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => {
        setExams(data)
        setLoading(false)
      })
      .catch(() => {
        setError("โหลดข้อสอบไม่สำเร็จ กรุณาลองใหม่")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            สวัสดี {studentName}!
          </h1>
          <p className="text-muted-foreground">เลือกชุดข้อสอบที่ต้องการทำ</p>
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
        <div className="space-y-4 mt-6">
          {loading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              กำลังโหลดข้อสอบ...
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-destructive">{error}</div>
          )}

          {!loading && !error && exams.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              ยังไม่มีข้อสอบที่เผยแพร่แล้ว
            </div>
          )}

          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-200 group"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/20">
                    <FileText className="w-6 h-6 text-accent" />
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
                        {exam.durationMins} นาที
                      </span>
                      {exam.pdfUrl && (
                        <span className="flex items-center gap-1 text-accent">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          มีไฟล์ PDF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <Button
                      onClick={() => onSelectExam(exam.id)}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      เริ่มทำข้อสอบ
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
