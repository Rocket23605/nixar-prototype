// schema.prisma

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String   // hashed
  displayName String
  role        Role     @default(STUDENT)
  createdAt   DateTime @default(now())

  examAttempts ExamAttempt[]
}

enum Role {
  STUDENT
  ADMIN
  TEACHER
}

// ชุดข้อสอบ
model ExamSet {
  id            String   @id @default(cuid())
  title         String                    // "ข้อสอบ A-Level คณิตศาสตร์ ชุด 2"
  subject       String                    // "คณิตศาสตร์", "ฟิสิกส์"
  level         String                    // "A-Level", "PAT", "O-NET"
  description   String?
  durationMins  Int                       // 36 นาที
  isPublished   Boolean  @default(false)
  createdAt     DateTime @default(now())

  // PDF ที่แนบมากับข้อสอบ (ถ้ามี)
  pdfUrl        String?                   // URL ใน Supabase Storage
  pdfFileName   String?

  questions     Question[]
  examAttempts  ExamAttempt[]
}

// ข้อสอบแต่ละข้อ
model Question {
  id            String   @id @default(cuid())
  examSetId     String
  order         Int                       // ลำดับที่ 1, 2, 3...
  category      String                    // "แคลคูลัส", "พีชคณิต"
  questionText  String                    // โจทย์ (รองรับ LaTeX หรือ markdown)
  
  // ถ้าโจทย์มีรูปภาพประกอบ
  imageUrl      String?                   // URL ใน Supabase Storage

  correctAnswer String                    // "A", "B", "C", "D"
  explanation   String?                   // คำอธิบายเฉลย

  choices       Choice[]
  examSet       ExamSet  @relation(fields: [examSetId], references: [id])
  answers       Answer[]
}

// ตัวเลือก A B C D
model Choice {
  id         String   @id @default(cuid())
  questionId String
  key        String   // "A", "B", "C", "D"
  value      String   // เนื้อหาของตัวเลือก

  question   Question @relation(fields: [questionId], references: [id])
}

// การสอบแต่ละครั้ง
model ExamAttempt {
  id          String      @id @default(cuid())
  userId      String
  examSetId   String
  startedAt   DateTime    @default(now())
  submittedAt DateTime?
  score       Int?        // คะแนนที่ได้
  totalScore  Int?        // คะแนนเต็ม

  // PDF ที่ user ส่งมาประกอบ (ถ้าต้องการ)
  pdfUrl      String?

  user        User        @relation(fields: [userId], references: [id])
  examSet     ExamSet     @relation(fields: [examSetId], references: [id])
  answers     Answer[]
  aiReport    AIReport?
}

// คำตอบของผู้สอบ
model Answer {
  id            String      @id @default(cuid())
  attemptId     String
  questionId    String
  selectedKey   String?     // "A", "B", "C", "D" ที่ user เลือก
  isCorrect     Boolean?

  attempt       ExamAttempt @relation(fields: [attemptId], references: [id])
  question      Question    @relation(fields: [questionId], references: [id])
}

// รายงาน AI หลังสอบ
model AIReport {
  id          String      @id @default(cuid())
  attemptId   String      @unique
  summary     String      // สรุปผล
  strengths   String[]    // จุดแข็ง
  weaknesses  String[]    // จุดที่ต้องพัฒนา
  suggestions String[]    // คำแนะนำ
  createdAt   DateTime    @default(now())

  attempt     ExamAttempt @relation(fields: [attemptId], references: [id])
}

โครงสร้างไฟล์ใน Supabase Storage
supabase-storage/
├── exam-pdfs/
│   ├── {examSetId}/
│   │   └── exam-document.pdf        ← PDF โจทย์ที่ admin อัพโหลด
│
├── question-images/
│   ├── {questionId}/
│   │   └── question-image.png       ← รูปประกอบโจทย์แต่ละข้อ
│
└── student-uploads/                 ← ถ้า student ต้องส่ง PDF
    └── {attemptId}/
        └── answer-sheet.pdf

Flow การทำงาน
Admin อัพโหลด PDF → Supabase Storage
                  → เก็บ URL ใน ExamSet.pdfUrl
                  
Student ทำข้อสอบ → ดู PDF (จาก pdfUrl)
                 → เลือก choices → บันทึกใน Answer
                 → Submit → คำนวณ score
                          → เรียก AI API
                          → บันทึก AIReport

API Routes ที่ต้องสร้าง
app/api/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── exams/
│   ├── route.ts                  GET: list exams
│   ├── [id]/route.ts             GET: exam detail + questions
│   └── [id]/submit/route.ts      POST: submit answers → score + AI report
├── admin/
│   ├── exams/route.ts            POST: create exam set
│   ├── exams/[id]/route.ts       PUT/DELETE
│   └── upload/route.ts           POST: upload PDF → Supabase Storage
└── reports/
    └── [attemptId]/route.ts      GET: AI report
