# Test Plan: PDF Upload (Admin) → Exam Selection (Student)

## ภาพรวม

ทดสอบ 2 flow หลัก:
1. **Admin** อัพโหลด PDF เข้า Supabase Storage แล้วผูกกับชุดข้อสอบ
2. **Student** login แล้วเห็นชุดข้อสอบที่มี PDF พร้อมเริ่มทำได้

## Test Accounts

| Role    | Username     | Password      | Display Name  |
|---------|-------------|---------------|---------------|
| Admin   | `admin`      | `admin1234`   | ผู้ดูแลระบบ   |
| Student | `student01`  | `student1234` | น้องทดสอบ     |

## Test Data

| Exam Set ID                            | ชื่อ                        | isPublished |
|----------------------------------------|-----------------------------|-------------|
| `452024b7-731f-49f1-881d-6ab71b757c3b` | ชุดทดสอบ PAT1 คณิตศาสตร์    | true        |

---

## FLOW 1: Admin อัพโหลด PDF

### TC-01 — Login ด้วย Admin ได้สำเร็จ

| | |
|-|---|
| **URL** | `http://localhost:3000/login` |
| **Steps** | 1. กรอก username: `admin` <br>2. กรอก password: `admin1234` <br>3. กด Login |
| **Expected** | เข้าสู่หน้า Admin Dashboard ทันที (ไม่ไปหน้า exam-selection) |
| **Pass Criteria** | เห็น header "แดชบอร์ดผู้ดูแลระบบ" และ KPI cards 3 ใบ |

---

### TC-02 — Dropdown ชุดข้อสอบโหลดมาถูกต้อง

| | |
|-|---|
| **Pre-condition** | Login เป็น admin สำเร็จ (TC-01) |
| **Steps** | 1. เลื่อนลงมาที่ section "อัปโหลด PDF ข้อสอบ" |
| **Expected** | Dropdown แสดง "ชุดทดสอบ PAT1 คณิตศาสตร์" |
| **Pass Criteria** | มีอย่างน้อย 1 รายการใน dropdown |

---

### TC-03 — อัพโหลด PDF สำเร็จ (Happy Path)

| | |
|-|---|
| **Pre-condition** | TC-02 ผ่าน, มีไฟล์ PDF ขนาด < 10MB พร้อม |
| **Steps** | 1. เลือก "ชุดทดสอบ PAT1 คณิตศาสตร์" ใน dropdown <br>2. คลิก drop zone <br>3. เลือกไฟล์ PDF <br>4. รอ |
| **Expected** | - Drop zone แสดง spinner + "กำลังอัปโหลด..." ระหว่างรอ <br>- เปลี่ยนเป็น ✅ "อัปโหลดสำเร็จ!" พร้อมชื่อไฟล์ <br>- รายการ exam ในตารางด้านล่างแสดง ✅ "มี PDF" |
| **Pass Criteria** | status = success, ชื่อไฟล์ถูกต้อง |

---

### TC-04 — ตรวจสอบ PDF ใน Supabase Storage

| | |
|-|---|
| **Pre-condition** | TC-03 ผ่าน |
| **Steps** | 1. เปิด Supabase Dashboard → Storage → bucket `nixar` <br>2. ดูใน folder `exam-pdfs/452024b7-.../` |
| **Expected** | มีไฟล์ `exam-document.pdf` อยู่ใน folder |
| **Pass Criteria** | ไฟล์มีอยู่จริงและ public URL ใช้งานได้ (เปิดในเบราว์เซอร์ได้) |

---

### TC-05 — ตรวจสอบ pdfUrl ถูกบันทึกใน Database

| | |
|-|---|
| **Pre-condition** | TC-03 ผ่าน |
| **SQL ทดสอบ** | `SELECT title, pdf_url, pdf_file_name FROM exam_sets WHERE id = '452024b7-731f-49f1-881d-6ab71b757c3b';` |
| **Expected** | `pdf_url` มีค่าเป็น Supabase public URL, `pdf_file_name` มีชื่อไฟล์ |
| **Pass Criteria** | ทั้งสองคอลัมน์ไม่เป็น NULL |

---

### TC-06 — อัพโหลดโดยไม่เลือกชุดข้อสอบ (Error Case)

| | |
|-|---|
| **Pre-condition** | Admin Dashboard เปิดอยู่ |
| **Steps** | 1. ล้าง dropdown ให้ไม่มีค่า (ถ้าทำได้) หรือ mock state <br>2. พยายามคลิก drop zone |
| **Expected** | แสดง error "กรุณาเลือกชุดข้อสอบก่อน" |
| **Pass Criteria** | ไม่มี API call ไปที่ `/api/admin/upload` |

---

### TC-07 — อัพโหลดไฟล์ที่ไม่ใช่ PDF (Error Case)

| | |
|-|---|
| **Steps** | พยายาม drag หรือเลือกไฟล์ `.jpg` หรือ `.docx` |
| **Expected** | Browser file picker กรองให้เลือกเฉพาะ `.pdf` เท่านั้น |
| **Pass Criteria** | ไฟล์ที่ไม่ใช่ PDF ถูกป้องกันด้วย `accept=".pdf"` |

---

## FLOW 2: Student เห็นและเลือกชุดข้อสอบ

### TC-08 — Login ด้วย Student ได้สำเร็จ

| | |
|-|---|
| **URL** | `http://localhost:3000/login` |
| **Steps** | 1. กรอก username: `student01` <br>2. กรอก password: `student1234` <br>3. กด Login |
| **Expected** | เข้าสู่หน้า Exam Selection (ไม่ไปหน้า admin) |
| **Pass Criteria** | เห็น header "สวัสดี น้องทดสอบ!" และรายการข้อสอบ |

---

### TC-09 — Student เห็นชุดข้อสอบที่ isPublished = true

| | |
|-|---|
| **Pre-condition** | TC-08 ผ่าน |
| **Expected** | เห็นการ์ด "ชุดทดสอบ PAT1 คณิตศาสตร์" ในรายการ |
| **Pass Criteria** | Card แสดง: ชื่อข้อสอบ, จำนวนข้อ, เวลา (90 นาที), และปุ่ม "เริ่มทำข้อสอบ" |

---

### TC-10 — Card แสดง Badge "มีไฟล์ PDF" หลัง Admin อัพโหลด

| | |
|-|---|
| **Pre-condition** | TC-03 ผ่าน (admin อัพโหลด PDF แล้ว), login เป็น student |
| **Expected** | Card ชุดข้อสอบแสดง ✅ "มีไฟล์ PDF" (สีเขียว) |
| **Pass Criteria** | Badge ปรากฏใต้ชื่อ ถัดจากจำนวนข้อและเวลา |

---

### TC-11 — Student ไม่เห็นชุดข้อสอบที่ isPublished = false

| | |
|-|---|
| **Setup** | สร้าง exam set ใหม่ใน DB โดยตั้ง `is_published = false` |
| **Expected** | ชุดข้อสอบ unpublished ไม่ปรากฏในรายการ |
| **Pass Criteria** | `GET /api/exams` คืนเฉพาะ published exams เท่านั้น |

---

### TC-12 — Student ไม่สามารถเข้าหน้า Admin ได้

| | |
|-|---|
| **Pre-condition** | Login เป็น student |
| **Steps** | พยายามเข้า `/app` โดยตรง |
| **Expected** | เห็นหน้า Exam Selection ไม่ใช่ Admin Dashboard |
| **Pass Criteria** | role check ใน `useEffect` ทำงานถูกต้อง — ไม่มี view "admin" ให้ student |

---

## สรุป Checklist ก่อนทดสอบ

- [ ] รัน `npm run dev` สำเร็จ
- [ ] เชื่อมต่อ Supabase ได้ (ตรวจ `.env`)
- [ ] มีไฟล์ PDF ทดสอบขนาด < 10MB พร้อม
- [ ] Supabase Storage bucket `nixar` มีอยู่และเปิด public access

## ลำดับ Test ที่แนะนำ

```
TC-01 → TC-02 → TC-03 → TC-04 → TC-05 → TC-06 → TC-07
                   ↓
TC-08 → TC-09 → TC-10 → TC-11 → TC-12
```
