export interface AIAnalysis {
  priority: 'high' | 'medium' | 'low'
  category: string
  estimatedTime: string
  riskLevel: string
  suggestions: string[]
  autoFixes: string[]
}

export interface RepairRequest {
  id: string
  title: string
  description: string
  location: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  category: string
  requester: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

// AI Analysis Function
export const analyzeRequest = (request: RepairRequest): AIAnalysis => {
  const analysis: AIAnalysis = {
    priority: 'medium',
    category: 'other',
    estimatedTime: '1-2 วัน',
    riskLevel: 'ต่ำ',
    suggestions: [],
    autoFixes: []
  }

  // Auto-detect priority based on keywords
  const highPriorityKeywords = ['ไฟ', 'ไฟฟ้า', 'น้ำรั่ว', 'น้ำท่วม', 'แอร์เสีย', 'แอร์ไม่เย็น', 'ประตูเสีย', 'ล็อค', 'ความปลอดภัย', 'ฉุกเฉิน']
  const mediumPriorityKeywords = ['เครื่องถ่ายเอกสาร', 'เครื่องพิมพ์', 'คอมพิวเตอร์', 'อินเทอร์เน็ต', 'WiFi', 'เสียงดัง', 'แสงสว่าง']
  
  const titleLower = request.title.toLowerCase()
  const descLower = request.description.toLowerCase()
  
  if (highPriorityKeywords.some(keyword => titleLower.includes(keyword) || descLower.includes(keyword))) {
    analysis.priority = 'high'
    analysis.estimatedTime = '2-4 ชั่วโมง'
    analysis.riskLevel = 'สูง'
  } else if (mediumPriorityKeywords.some(keyword => titleLower.includes(keyword) || descLower.includes(keyword))) {
    analysis.priority = 'medium'
    analysis.estimatedTime = '1-2 วัน'
    analysis.riskLevel = 'ปานกลาง'
  } else {
    analysis.priority = 'low'
    analysis.estimatedTime = '3-5 วัน'
    analysis.riskLevel = 'ต่ำ'
  }

  // Auto-detect category
  if (titleLower.includes('ไฟฟ้า') || titleLower.includes('ไฟ') || descLower.includes('ไฟฟ้า')) {
    analysis.category = 'ระบบไฟฟ้า'
  } else if (titleLower.includes('แอร์') || descLower.includes('แอร์')) {
    analysis.category = 'ระบบปรับอากาศ'
  } else if (titleLower.includes('น้ำ') || descLower.includes('น้ำ')) {
    analysis.category = 'ระบบน้ำ'
  } else if (titleLower.includes('ประตู') || titleLower.includes('หน้าต่าง') || descLower.includes('ไม้')) {
    analysis.category = 'งานไม้'
  } else if (titleLower.includes('เครื่อง') || titleLower.includes('คอมพิวเตอร์') || descLower.includes('อุปกรณ์')) {
    analysis.category = 'อุปกรณ์สำนักงาน'
  }

  // Generate suggestions
  if (analysis.priority === 'high') {
    analysis.suggestions.push('ควรดำเนินการภายใน 24 ชั่วโมง')
    analysis.suggestions.push('แจ้งเตือนทีมซ่อมบำรุงทันที')
    analysis.suggestions.push('เตรียมอุปกรณ์สำรอง')
  } else if (analysis.priority === 'medium') {
    analysis.suggestions.push('ควรดำเนินการภายใน 3-5 วัน')
    analysis.suggestions.push('จัดลำดับความสำคัญ')
    analysis.suggestions.push('ตรวจสอบงบประมาณ')
  } else {
    analysis.suggestions.push('สามารถดำเนินการตามปกติ')
    analysis.suggestions.push('จัดตารางงานประจำ')
    analysis.suggestions.push('ตรวจสอบคุณภาพงาน')
  }

  // Auto-fix suggestions
  if (!request.title.trim()) {
    analysis.autoFixes.push('เพิ่มหัวข้อที่ชัดเจน')
  }
  
  if (request.description.length < 10) {
    analysis.autoFixes.push('เพิ่มรายละเอียดให้ครบถ้วน')
  }
  
  if (!request.location.trim()) {
    analysis.autoFixes.push('ระบุสถานที่ให้ชัดเจน')
  }
  
  if (!request.requester.trim()) {
    analysis.autoFixes.push('ระบุผู้แจ้ง')
  }
  
  if (!request.phone.trim()) {
    analysis.autoFixes.push('ระบุเบอร์โทรศัพท์')
  }

  return analysis
}

// Auto Error Detection
export const detectErrors = (request: RepairRequest): string[] => {
  const errors: string[] = []
  
  if (!request.title.trim()) {
    errors.push('❌ ไม่มีหัวข้อ')
  }
  
  if (!request.description.trim()) {
    errors.push('❌ ไม่มีรายละเอียด')
  }
  
  if (!request.location.trim()) {
    errors.push('❌ ไม่ระบุสถานที่')
  }
  
  if (!request.requester.trim()) {
    errors.push('❌ ไม่ระบุผู้แจ้ง')
  }
  
  if (!request.phone.trim()) {
    errors.push('❌ ไม่ระบุเบอร์โทร')
  }
  
  if (request.priority === 'high' && request.status === 'pending') {
    errors.push('⚠️ ปัญหาความเร่งด่วนสูงยังไม่ได้รับการจัดการ')
  }
  
  if (request.description.length < 10) {
    errors.push('⚠️ รายละเอียดสั้นเกินไป')
  }
  
  return errors
}

// Auto Fix Function
export const autoFixRequest = (request: RepairRequest): RepairRequest => {
  const fixedRequest = { ...request }
  
  // Auto-fix empty fields with default values
  if (!fixedRequest.title.trim()) {
    fixedRequest.title = 'แจ้งซ่อมทั่วไป'
  }
  
  if (!fixedRequest.description.trim()) {
    fixedRequest.description = 'กรุณาระบุรายละเอียดเพิ่มเติม'
  }
  
  if (!fixedRequest.location.trim()) {
    fixedRequest.location = 'ไม่ระบุสถานที่'
  }
  
  if (!fixedRequest.requester.trim()) {
    fixedRequest.requester = 'ไม่ระบุผู้แจ้ง'
  }
  
  if (!fixedRequest.phone.trim()) {
    fixedRequest.phone = 'ไม่ระบุเบอร์โทร'
  }
  
  // Auto-update status for high priority items
  if (fixedRequest.priority === 'high' && fixedRequest.status === 'pending') {
    fixedRequest.status = 'in-progress'
  }
  
  // Auto-update timestamp
  fixedRequest.updatedAt = new Date()
  
  return fixedRequest
}

// Smart Priority Suggestion
export const suggestPriority = (title: string, description: string): 'high' | 'medium' | 'low' => {
  const text = (title + ' ' + description).toLowerCase()
  
  const highPriorityWords = ['ไฟ', 'ไฟฟ้า', 'น้ำรั่ว', 'น้ำท่วม', 'แอร์เสีย', 'แอร์ไม่เย็น', 'ประตูเสีย', 'ล็อค', 'ความปลอดภัย', 'ฉุกเฉิน', 'ด่วน', 'เร่งด่วน']
  const mediumPriorityWords = ['เครื่องถ่ายเอกสาร', 'เครื่องพิมพ์', 'คอมพิวเตอร์', 'อินเทอร์เน็ต', 'WiFi', 'เสียงดัง', 'แสงสว่าง', 'ปานกลาง']
  
  if (highPriorityWords.some(word => text.includes(word))) {
    return 'high'
  } else if (mediumPriorityWords.some(word => text.includes(word))) {
    return 'medium'
  }
  
  return 'low'
}

// Category Suggestion
export const suggestCategory = (title: string, description: string): string => {
  const text = (title + ' ' + description).toLowerCase()
  
  if (text.includes('ไฟฟ้า') || text.includes('ไฟ')) {
    return 'ระบบไฟฟ้า'
  } else if (text.includes('แอร์')) {
    return 'ระบบปรับอากาศ'
  } else if (text.includes('น้ำ')) {
    return 'ระบบน้ำ'
  } else if (text.includes('ประตู') || text.includes('หน้าต่าง') || text.includes('ไม้')) {
    return 'งานไม้'
  } else if (text.includes('เครื่อง') || text.includes('คอมพิวเตอร์') || text.includes('อุปกรณ์')) {
    return 'อุปกรณ์สำนักงาน'
  }
  
  return 'อื่นๆ'
} 