# 🚀 ระบบแจ้งซ่อม KKRDC - AI-Powered

ระบบแจ้งซ่อมขั้นสูงที่พัฒนาด้วย Next.js 14, TypeScript และ AI

## ✨ ฟีเจอร์หลัก

### 🎯 ระบบหลัก
- **แจ้งซ่อมใหม่** - ฟอร์มขั้นสูงพร้อม AI Suggestions
- **ดูรายการแจ้งซ่อม** - แสดงผลแบบ Real-time
- **ค้นหาขั้นสูง** - ค้นหาด้วย AI
- **อัปเดตสถานะ** - แบบ Real-time
- **ระบบความเร่งด่วน** - 3 ระดับ

### 🤖 AI Features
- **AI Analysis** - วิเคราะห์ปัญหาอัตโนมัติ
- **Auto Error Detection** - ตรวจจับข้อผิดพลาด
- **Smart Priority** - แนะนำความเร่งด่วน
- **Category Suggestion** - แนะนำหมวดหมู่
- **Auto Fix** - แก้ไขข้อผิดพลาดอัตโนมัติ

### 👨‍💼 Admin Dashboard
- **Statistics** - สถิติแบบ Real-time
- **AI Analysis Panel** - วิเคราะห์ด้วย AI
- **Error Detection** - ตรวจจับข้อผิดพลาด
- **Auto Fix Suggestions** - คำแนะนำการแก้ไข

### 💾 ระบบฐานข้อมูล
- **Local Storage** - เก็บข้อมูลในเบราว์เซอร์
- **Backup/Restore** - สำรองและกู้คืนข้อมูล
- **Export/Import** - นำเข้า/ส่งออกข้อมูล
- **Auto Save** - บันทึกอัตโนมัติ

## 🛠️ การติดตั้ง

```bash
# Clone repository
git clone <your-repo-url>
cd repair-system

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 การใช้งาน

### หน้าหลัก
1. เปิดเว็บไซต์ที่ `http://localhost:3000`
2. ดูสถิติแบบ Real-time
3. คลิก "✨ แจ้งซ่อมใหม่" เพื่อเพิ่มรายการ
4. ใช้ช่องค้นหาเพื่อหารายการที่ต้องการ
5. เปลี่ยนสถานะโดยใช้ dropdown

### Admin Dashboard
1. คลิก "👨‍💼 Admin" ที่ header
2. ดูสถิติและกราฟ
3. ใช้ AI Analysis เพื่อวิเคราะห์ปัญหา
4. ตรวจสอบ Auto Error Detection
5. ดูคำแนะนำการแก้ไข

### AI Features
- **Smart Priority**: ระบบจะแนะนำความเร่งด่วนตามคำที่ใช้
- **Category Detection**: ระบุหมวดหมู่อัตโนมัติ
- **Error Detection**: ตรวจจับข้อผิดพลาดในข้อมูล
- **Auto Fix**: แก้ไขข้อผิดพลาดอัตโนมัติ

## 📊 ฟีเจอร์ขั้นสูง

### 🎨 UI/UX
- **Modern Design** - ดีไซน์ทันสมัย
- **Responsive** - รองรับทุกอุปกรณ์
- **Dark/Light Mode** - โหมดมืด/สว่าง
- **Animations** - เอฟเฟกต์การเคลื่อนไหว
- **Gradients** - ไล่สีสวยงาม

### 🔧 Technical Features
- **TypeScript** - Type Safety
- **Next.js 14** - App Router
- **Tailwind CSS** - Utility-first CSS
- **Local Storage** - Client-side Database
- **AI Integration** - Smart Features

### 📱 Mobile Friendly
- **Touch Optimized** - ปุ่มใหญ่สำหรับมือถือ
- **Responsive Grid** - ตารางปรับขนาด
- **Mobile Navigation** - เมนูมือถือ
- **Touch Gestures** - การสัมผัส

## 🌐 การ Deploy

### Vercel (แนะนำ)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# หรือเชื่อมต่อกับ GitHub
# 1. Push code ไป GitHub
# 2. สร้างโปรเจคใน Vercel
# 3. เชื่อมต่อ GitHub repository
# 4. Deploy อัตโนมัติ
```

### Netlify
```bash
# Build project
npm run build

# Deploy to Netlify
# 1. สร้างโปรเจคใน Netlify
# 2. เชื่อมต่อ GitHub repository
# 3. Set build command: npm run build
# 4. Set publish directory: .next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขไฟล์ `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### เพิ่มฟีเจอร์ใหม่
1. สร้าง component ใหม่ใน `app/components/`
2. เพิ่ม route ใหม่ใน `app/`
3. อัปเดต navigation
4. ทดสอบฟีเจอร์

## 📈 การพัฒนาต่อ

### ฟีเจอร์ที่แนะนำ
- [ ] **Real Database** - MongoDB/PostgreSQL
- [ ] **Authentication** - Login/Register
- [ ] **Email Notifications** - แจ้งเตือนอีเมล
- [ ] **SMS Notifications** - แจ้งเตือน SMS
- [ ] **File Upload** - อัปโหลดรูปภาพ
- [ ] **QR Code** - สแกน QR Code
- [ ] **Mobile App** - แอปมือถือ
- [ ] **API Integration** - เชื่อมต่อ API ภายนอก

### Performance
- [ ] **Caching** - Redis Cache
- [ ] **CDN** - Content Delivery Network
- [ ] **Image Optimization** - Optimize Images
- [ ] **Code Splitting** - Lazy Loading

## 🤝 การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. สร้าง Issue ใน GitHub
2. ติดต่อทีมพัฒนา
3. ดู Documentation เพิ่มเติม

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

---

**พัฒนาโดยทีม KKRDC** 🚀 