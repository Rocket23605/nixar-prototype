"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  Brain,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Loader2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const KPI_DATA = [
  { title: "จำนวนนักเรียนทั้งหมด", value: "2,847", change: "+12.5%", isPositive: true, icon: Users },
  { title: "ข้อสอบที่ทำแล้ว", value: "1,284", change: "+8.3%", isPositive: true, icon: FileText },
  { title: "รายงาน AI ที่สร้าง", value: "923", change: "+18.7%", isPositive: true, icon: Brain },
]

const ERROR_RATE_DATA = [
  { topic: "แคลคูลัส", rate: 68, color: "var(--chart-1)" },
  { topic: "ลอการิทึม", rate: 61, color: "var(--chart-3)" },
  { topic: "ตรีโกณมิติ", rate: 52, color: "var(--chart-4)" },
  { topic: "พีชคณิต", rate: 45, color: "var(--chart-2)" },
  { topic: "สถิติ", rate: 38, color: "var(--chart-5)" },
]

const RECENT_STUDENTS = [
  { name: "น้องมิน", exam: "ชุด 1", score: "60%", weakness: "แคลคูลัส", date: "วันนี้" },
  { name: "น้องโอม", exam: "ชุด 2", score: "80%", weakness: "ตรีโกณมิติ", date: "วันนี้" },
  { name: "น้องเฟิร์น", exam: "ชุด 1", score: "45%", weakness: "ลอการิทึม", date: "เมื่อวาน" },
  { name: "น้องแพร", exam: "ชุด 3", score: "72%", weakness: "พีชคณิต", date: "เมื่อวาน" },
  { name: "น้องบีม", exam: "ชุด 2", score: "88%", weakness: "-", date: "2 วันก่อน" },
]

interface ExamItem {
  id: string
  title: string
  pdfUrl: string | null
  pdfFileName: string | null
}

export function AdminDashboardThai() {
  const [exams, setExams] = useState<ExamItem[]>([])
  const [selectedExamId, setSelectedExamId] = useState("")
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/admin/exams")
      .then((r) => r.json())
      .then((data: ExamItem[]) => {
        setExams(data)
        if (data.length > 0) setSelectedExamId(data[0].id)
      })
      .catch(() => {})
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!selectedExamId) {
      setUploadError("กรุณาเลือกชุดข้อสอบก่อน")
      return
    }

    setUploadStatus("uploading")
    setUploadError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("examSetId", selectedExamId)
    formData.append("type", "exam-pdfs")

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setUploadStatus("error")
        setUploadError(data.error || "อัปโหลดไม่สำเร็จ")
      } else {
        setUploadStatus("success")
        setUploadedFileName(data.fileName)
        // Update local exam list
        setExams((prev) =>
          prev.map((ex) =>
            ex.id === selectedExamId
              ? { ...ex, pdfUrl: data.url, pdfFileName: data.fileName }
              : ex
          )
        )
        setTimeout(() => setUploadStatus("idle"), 4000)
      }
    } catch {
      setUploadStatus("error")
      setUploadError("เกิดข้อผิดพลาด กรุณาลองใหม่")
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const selectedExam = exams.find((e) => e.id === selectedExamId)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="text-muted-foreground">ภาพรวมสถิติและการวิเคราะห์ข้อมูลนักเรียน</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {KPI_DATA.map((kpi) => (
            <Card key={kpi.title} className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <span className={`text-sm ${kpi.isPositive ? "text-success" : "text-destructive"}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <kpi.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Error Rate Chart */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="w-5 h-5 text-warning" />
                หัวข้อที่นักเรียนทำผิดมากที่สุด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ERROR_RATE_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="var(--foreground)" tick={{ fill: "var(--foreground)", fontSize: 12 }} tickLine={{ stroke: "var(--foreground)" }} />
                    <YAxis type="category" dataKey="topic" stroke="var(--foreground)" tick={{ fill: "var(--foreground)", fontSize: 12 }} tickLine={{ stroke: "var(--foreground)" }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} itemStyle={{ color: "var(--foreground)" }} formatter={(value: number) => [`${value}%`, "อัตราการทำผิด"]} />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                      {ERROR_RATE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    ข้อมูลนี้ช่วยให้สถาบันรู้ว่าควรเน้นสอนเรื่องใด —{" "}
                    <span className="text-foreground font-medium">แคลคูลัส</span> มีอัตราผิดสูงสุด
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-accent" />
                รายงานนักเรียนล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ชื่อ</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ชุดข้อสอบ</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">คะแนน</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">จุดอ่อน</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_STUDENTS.map((student, idx) => (
                      <tr key={idx} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-2 text-sm text-foreground font-medium">{student.name}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">{student.exam}</td>
                        <td className="py-3 px-2">
                          <span className={`text-sm font-medium ${parseInt(student.score) >= 60 ? "text-success" : "text-destructive"}`}>
                            {student.score}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">{student.weakness}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">{student.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Upload Section */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-5 h-5 text-accent" />
              อัปโหลด PDF ข้อสอบ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exam Selector */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                เลือกชุดข้อสอบ
              </label>
              {exams.length === 0 ? (
                <p className="text-sm text-muted-foreground">ยังไม่มีชุดข้อสอบในระบบ</p>
              ) : (
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Current PDF Status */}
            {selectedExam?.pdfUrl && (
              <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                PDF ปัจจุบัน: {selectedExam.pdfFileName || "exam-document.pdf"}
              </div>
            )}

            {/* Drop Zone */}
            <div
              onClick={() => uploadStatus === "idle" && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                uploadStatus === "success"
                  ? "border-success/50 bg-success/5 cursor-default"
                  : uploadStatus === "uploading"
                  ? "border-accent/50 bg-accent/5 cursor-default"
                  : uploadStatus === "error"
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              {uploadStatus === "success" ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-success mb-4" />
                  <p className="text-foreground font-medium">อัปโหลดสำเร็จ!</p>
                  <p className="text-sm text-muted-foreground mt-1">{uploadedFileName}</p>
                </div>
              ) : uploadStatus === "uploading" ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-accent mb-4 animate-spin" />
                  <p className="text-foreground font-medium">กำลังอัปโหลด...</p>
                  <p className="text-sm text-muted-foreground">กรุณารอสักครู่</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    คลิกเพื่อเลือกไฟล์ PDF
                  </p>
                  <p className="text-sm text-muted-foreground">รองรับ PDF สูงสุด 10MB</p>
                  {uploadStatus === "error" && (
                    <p className="text-sm text-destructive mt-2">{uploadError}</p>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Exam List with PDF Status */}
            {exams.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  สถานะ PDF ชุดข้อสอบทั้งหมด
                </h4>
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                    >
                      <span className="text-sm text-foreground truncate flex-1 mr-3">{exam.title}</span>
                      {exam.pdfUrl ? (
                        <span className="flex items-center gap-1 text-xs text-success shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          มี PDF
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground shrink-0">ยังไม่มี PDF</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
