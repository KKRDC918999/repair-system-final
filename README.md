# 🔧 ระบบแจ้งซ่อม KKRDC

ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI สำหรับองค์กร KKRDC

## ✨ คุณสมบัติหลัก

### 🎯 **ระบบหลัก**
- **แจ้งซ่อมออนไลน์** - ระบบแจ้งซ่อมที่ใช้งานง่าย
- **ติดตามสถานะ** - ติดตามความคืบหน้าการซ่อมแซมแบบเรียลไทม์
- **ค้นหาและกรอง** - ค้นหาการแจ้งซ่อมตามเงื่อนไขต่างๆ
- **สถิติและรายงาน** - แสดงสถิติการแจ้งซ่อมแบบครบถ้วน

### 🤖 **AI Features**
- **AI Analysis** - วิเคราะห์ปัญหาด้วย AI อัตโนมัติ
- **Auto Error Detection** - ตรวจจับข้อผิดพลาดอัตโนมัติ
- **Smart Priority** - จัดลำดับความสำคัญอัตโนมัติ
- **Category Inference** - ระบุหมวดหมู่ปัญหาอัตโนมัติ
- **Auto-fix Suggestions** - แนะนำการแก้ไขอัตโนมัติ

### 👨‍💼 **Admin Dashboard**
- **จัดการแจ้งซ่อม** - จัดการรายการแจ้งซ่อมทั้งหมด
- **AI Analysis Panel** - วิเคราะห์ปัญหาด้วย AI
- **Error Detection** - ตรวจจับและแก้ไขข้อผิดพลาด
- **สถิติแบบละเอียด** - สถิติการทำงานแบบครบถ้วน

## 🚀 การติดตั้ง

### Prerequisites
- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/KKRDC918999/repair-system-final.git
cd repair-system-final
```

2. **ติดตั้ง Dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **รัน Development Server**
```bash
npm run dev
# หรือ
yarn dev
```

4. **เปิดเว็บไซต์**
```
http://localhost:3000
```

## 📁 โครงสร้างโปรเจค

```
repair-system-final/
├── app/
│   ├── page.tsx              # หน้าหลัก
│   ├── admin/
│   │   └── page.tsx          # Admin Dashboard
│   └── utils/
│       ├── aiHelper.ts       # AI Functions
│       └── database.ts       # Database Operations
├── public/                   # Static Files
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Local Storage** - Client-side Database
- **AI Simulation** - Smart Analysis

## 📊 คุณสมบัติ AI

### 🤖 AI Analysis
- วิเคราะห์ระดับความเร่งด่วน
- ประเมินความเสี่ยง
- แนะนำเวลาดำเนินการ
- ระบุประเภทปัญหาอัตโนมัติ

### 🔍 Error Detection
- ตรวจจับข้อมูลไม่ครบถ้วน
- ตรวจสอบความถูกต้องของข้อมูล
- แจ้งเตือนปัญหาวิกฤต
- แนะนำการแก้ไขอัตโนมัติ

### 📈 Smart Analytics
- สถิติการแจ้งซ่อม
- เวลาตอบสนองเฉลี่ย
- การวิเคราะห์หมวดหมู่
- รายงานประสิทธิภาพ

## 🎨 UI/UX Features

### 🎯 Modern Design
- **Responsive Design** - รองรับทุกอุปกรณ์
- **Dark/Light Mode** - โหมดสีสลับได้
- **Smooth Animations** - แอนิเมชันลื่นไหล
- **Intuitive Interface** - ใช้งานง่าย

### 📱 Mobile Friendly
- **Touch Optimized** - ปุ่มกดขนาดเหมาะสม
- **Swipe Gestures** - ใช้การเลื่อนนิ้ว
- **Fast Loading** - โหลดเร็ว
- **Offline Support** - ใช้งานได้แม้ไม่มีเน็ต

## 🔧 การใช้งาน

### 👤 สำหรับผู้ใช้ทั่วไป

1. **แจ้งซ่อมใหม่**
   - คลิกปุ่ม "แจ้งซ่อมใหม่"
   - กรอกข้อมูลให้ครบถ้วน
   - ระบบจะวิเคราะห์ด้วย AI อัตโนมัติ

2. **ติดตามสถานะ**
   - ดูรายการแจ้งซ่อมทั้งหมด
   - ค้นหาตามคำค้นหา
   - อัพเดทสถานะได้

3. **ดูสถิติ**
   - ดูสถิติการแจ้งซ่อม
   - ติดตามความคืบหน้า
   - ดูเวลาตอบสนอง

### 👨‍💼 สำหรับ Admin

1. **จัดการแจ้งซ่อม**
   - ดูรายการทั้งหมด
   - อัพเดทสถานะ
   - ลบรายการที่ไม่ต้องการ

2. **AI Analysis**
   - วิเคราะห์ปัญหาด้วย AI
   - ดูคำแนะนำอัตโนมัติ
   - ตรวจสอบข้อผิดพลาด

3. **สถิติและรายงาน**
   - ดูสถิติแบบละเอียด
   - วิเคราะห์ประสิทธิภาพ
   - ส่งออกรายงาน

## 🔒 ความปลอดภัย

- **Client-side Storage** - ข้อมูลเก็บในเครื่องผู้ใช้
- **Data Validation** - ตรวจสอบความถูกต้องของข้อมูล
- **Error Handling** - จัดการข้อผิดพลาดอย่างปลอดภัย
- **Backup System** - ระบบสำรองข้อมูล

## 📈 การพัฒนา

### 🚀 การ Deploy

1. **Vercel (แนะนำ)**
```bash
npm run build
vercel --prod
```

2. **Netlify**
```bash
npm run build
netlify deploy --prod
```

3. **GitHub Pages**
```bash
npm run build
npm run export
```

### 🔧 การ Customize

1. **เปลี่ยนธีมสี**
   - แก้ไขไฟล์ `tailwind.config.js`
   - ปรับสีใน `app/globals.css`

2. **เพิ่มฟีเจอร์**
   - เพิ่มหน้าใหม่ใน `app/`
   - เพิ่มฟังก์ชันใน `app/utils/`

3. **ปรับแต่ง AI**
   - แก้ไขไฟล์ `app/utils/aiHelper.ts`
   - เพิ่มกฎการวิเคราะห์

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Build Error**
```bash
npm run build
# ตรวจสอบ error log
```

2. **TypeScript Error**
```bash
npm run type-check
# แก้ไข type errors
```

3. **Styling Issues**
```bash
npm run dev
# ตรวจสอบ Tailwind CSS
```

## 📞 การสนับสนุน

- **Email**: support@kkrdc.com
- **Phone**: 02-123-4567
- **Line**: @kkrdc-support

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE)

## 🙏 ขอบคุณ

ขอบคุณทุกท่านที่ใช้งานระบบแจ้งซ่อม KKRDC

---

**พัฒนาโดย** KKRDC Development Team  
**เวอร์ชัน** 2.0.0  
**อัพเดทล่าสุด** 2024 