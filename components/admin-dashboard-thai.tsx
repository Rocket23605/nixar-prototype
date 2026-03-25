"use client"

import { useState } from "react"
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
  {
    title: "จำนวนนักเรียนทั้งหมด",
    value: "2,847",
    change: "+12.5%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "ข้อสอบที่ทำแล้ว",
    value: "1,284",
    change: "+8.3%",
    isPositive: true,
    icon: FileText,
  },
  {
    title: "รายงาน AI ที่สร้าง",
    value: "923",
    change: "+18.7%",
    isPositive: true,
    icon: Brain,
  },
]

const EXAM_AVERAGE_DATA = [
  { examSet: "ชุด 1", title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 1", avgScore: 65 },
  { examSet: "ชุด 2", title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 2", avgScore: 52 },
  { examSet: "ชุด 3", title: "ข้อสอบ A-Level คณิตศาสตร์ ชุด 3", avgScore: 58 },
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

export function AdminDashboardThai() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle")

  const handleUpload = () => {
    setUploadStatus("uploading")
    setTimeout(() => {
      setUploadStatus("success")
      setTimeout(() => setUploadStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="text-muted-foreground">
            ภาพรวมสถิติและการวิเคราะห์ข้อมูลนักเรียน
          </p>
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
                    <span
                      className={`text-sm ${
                        kpi.isPositive ? "text-success" : "text-destructive"
                      }`}
                    >
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

        {/* คะแนนเฉลี่ยแต่ละชุดข้อสอบ */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-accent" />
              คะแนนเฉลี่ยแต่ละชุดข้อสอบ
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              คะแนนเฉลี่ยของนักเรียนที่ทำข้อสอบแต่ละชุด
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXAM_AVERAGE_DATA.map((exam) => (
                <div
                  key={exam.examSet}
                  className="p-4 rounded-xl border border-border bg-background/50"
                >
                  <p className="text-sm font-medium text-foreground mb-3">
                    {exam.title}
                  </p>
                  <span
                    className={`text-2xl font-bold ${
                      exam.avgScore >= 60 ? "text-success" : "text-warning"
                    }`}
                  >
                    {exam.avgScore}%
                  </span>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        exam.avgScore >= 60 ? "bg-success" : "bg-warning"
                      }`}
                      style={{ width: `${exam.avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      stroke="var(--foreground)"
                      tick={{ fill: "var(--foreground)", fontSize: 12 }}
                      tickLine={{ stroke: "var(--foreground)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="topic"
                      stroke="var(--foreground)"
                      tick={{ fill: "var(--foreground)", fontSize: 12 }}
                      tickLine={{ stroke: "var(--foreground)" }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "var(--foreground)" }}
                      itemStyle={{ color: "var(--foreground)" }}
                      formatter={(value: number) => [`${value}%`, "อัตราการทำผิด"]}
                    />
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
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        ชื่อ
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        ชุดข้อสอบ
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        คะแนน
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        จุดอ่อน
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_STUDENTS.map((student, idx) => (
                      <tr key={idx} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-2 text-sm text-foreground font-medium">
                          {student.name}
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {student.exam}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-sm font-medium ${
                              parseInt(student.score) >= 60 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {student.score}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {student.weakness}
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {student.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-5 h-5 text-accent" />
              อัปโหลดข้อสอบใหม่
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={handleUpload}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                uploadStatus === "success"
                  ? "border-success/50 bg-success/5"
                  : uploadStatus === "uploading"
                  ? "border-accent/50 bg-accent/5"
                  : "border-border hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              {uploadStatus === "success" ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-success mb-4" />
                  <p className="text-foreground font-medium">อัปโหลดสำเร็จ!</p>
                  <p className="text-sm text-muted-foreground">
                    ข้อสอบถูกเพิ่มเข้าระบบเรียบร้อยแล้ว
                  </p>
                </div>
              ) : uploadStatus === "uploading" ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-foreground font-medium">กำลังอัปโหลด...</p>
                  <p className="text-sm text-muted-foreground">กรุณารอสักครู่</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก
                  </p>
                  <p className="text-sm text-muted-foreground">
                    รองรับไฟล์ PDF, DOCX (สูงสุด 10MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
