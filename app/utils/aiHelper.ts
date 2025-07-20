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

// AI Analysis Functions
export const analyzeRepairRequest = async (request: RepairRequest): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const priorityScore = request.priority === 'high' ? 3 : request.priority === 'medium' ? 2 : 1
  const urgencyKeywords = ['เสีย', 'ไม่ทำงาน', 'รั่ว', 'ไฟดับ', 'ร้อน', 'เย็น']
  const hasUrgencyKeywords = urgencyKeywords.some(keyword => 
    request.title.toLowerCase().includes(keyword) || 
    request.description.toLowerCase().includes(keyword)
  )
  
  let analysis = `🤖 **การวิเคราะห์ด้วย AI**\n\n`
  
  // Priority Analysis
  analysis += `**ระดับความเร่งด่วน**: ${getPriorityEmoji(request.priority)} ${getPriorityText(request.priority)}\n\n`
  
  // Category Analysis
  analysis += `**ประเภทปัญหา**: ${request.category}\n\n`
  
  // Risk Assessment
  const riskLevel = priorityScore === 3 || hasUrgencyKeywords ? 'สูง' : priorityScore === 2 ? 'ปานกลาง' : 'ต่ำ'
  analysis += `**ความเสี่ยง**: ${riskLevel} - ${getRiskDescription(riskLevel)}\n\n`
  
  // Recommendations
  analysis += `**คำแนะนำ**:\n${getRecommendations(request.priority, request.category)}\n\n`
  
  // Estimated Time
  analysis += `**เวลาที่แนะนำ**: ${getEstimatedTime(request.priority)}\n\n`
  
  // Auto-fix Suggestions
  const autoFixes = getAutoFixSuggestions(request)
  if (autoFixes.length > 0) {
    analysis += `**การแก้ไขอัตโนมัติ**:\n${autoFixes.join('\n')}\n\n`
  }
  
  return analysis
}

// Error Detection
export const detectErrors = (request: RepairRequest): string[] => {
  const errors: string[] = []
  
  if (!request.title.trim()) errors.push('❌ ไม่มีหัวข้อ')
  if (!request.description.trim()) errors.push('❌ ไม่มีรายละเอียด')
  if (!request.location.trim()) errors.push('❌ ไม่ระบุสถานที่')
  if (!request.requester.trim()) errors.push('❌ ไม่ระบุผู้แจ้ง')
  if (!request.phone.trim()) errors.push('❌ ไม่ระบุเบอร์โทร')
  
  // Business logic errors
  if (request.priority === 'high' && request.status === 'pending') {
    errors.push('⚠️ ปัญหาความเร่งด่วนสูงยังไม่ได้รับการจัดการ')
  }
  
  if (request.description.length < 10) {
    errors.push('⚠️ รายละเอียดสั้นเกินไป')
  }
  
  return errors
}

// Auto Fix Suggestions
export const getAutoFixSuggestions = (request: RepairRequest): string[] => {
  const suggestions: string[] = []
  
  if (!request.title.trim()) {
    suggestions.push('🔧 แนะนำ: เพิ่มหัวข้อที่ชัดเจน')
  }
  
  if (request.priority === 'high' && request.status === 'pending') {
    suggestions.push('🔧 แนะนำ: เปลี่ยนสถานะเป็น "กำลังดำเนินการ"')
  }
  
  if (request.description.length < 10) {
    suggestions.push('🔧 แนะนำ: เพิ่มรายละเอียดให้ครบถ้วน')
  }
  
  if (!request.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
    suggestions.push('🔧 แนะนำ: ตรวจสอบรูปแบบเบอร์โทร (081-234-5678)')
  }
  
  return suggestions
}

// Priority and Category Inference
export const inferPriority = (title: string, description: string): 'high' | 'medium' | 'low' => {
  const highPriorityKeywords = ['เสีย', 'ไม่ทำงาน', 'ไฟดับ', 'น้ำรั่ว', 'ร้อน', 'ฉุกเฉิน', 'ด่วน']
  const mediumPriorityKeywords = ['ช้า', 'ไม่สะดวก', 'ปรับปรุง', 'บำรุง']
  
  const text = (title + ' ' + description).toLowerCase()
  
  if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
    return 'high'
  } else if (mediumPriorityKeywords.some(keyword => text.includes(keyword))) {
    return 'medium'
  }
  
  return 'low'
}

export const inferCategory = (title: string, description: string): string => {
  const text = (title + ' ' + description).toLowerCase()
  
  if (text.includes('ไฟฟ้า') || text.includes('ไฟ') || text.includes('หลอด')) {
    return 'ระบบไฟฟ้า'
  } else if (text.includes('แอร์') || text.includes('เย็น') || text.includes('ปรับอากาศ')) {
    return 'ระบบปรับอากาศ'
  } else if (text.includes('น้ำ') || text.includes('ท่อ') || text.includes('รั่ว')) {
    return 'ระบบน้ำ'
  } else if (text.includes('ประตู') || text.includes('หน้าต่าง') || text.includes('ไม้')) {
    return 'งานไม้'
  } else if (text.includes('เครื่อง') || text.includes('คอมพิวเตอร์') || text.includes('พิมพ์')) {
    return 'อุปกรณ์สำนักงาน'
  }
  
  return 'อื่นๆ'
}

// Helper Functions
const getPriorityEmoji = (priority: string): string => {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

const getPriorityText = (priority: string): string => {
  switch (priority) {
    case 'high': return 'สูงมาก'
    case 'medium': return 'ปานกลาง'
    case 'low': return 'ต่ำ'
    default: return 'ไม่ระบุ'
  }
}

const getRiskDescription = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'สูง': return 'อาจส่งผลต่อการทำงานหลัก'
    case 'ปานกลาง': return 'อาจส่งผลต่อการทำงานบางส่วน'
    case 'ต่ำ': return 'ไม่กระทบการทำงานหลัก'
    default: return 'ไม่ระบุ'
  }
}

const getRecommendations = (priority: string, category: string): string => {
  let recommendations = ''
  
  switch (priority) {
    case 'high':
      recommendations += '• ควรดำเนินการภายใน 24 ชั่วโมง\n'
      recommendations += '• แจ้งเตือนทีมซ่อมบำรุงทันที\n'
      recommendations += '• เตรียมอุปกรณ์สำรอง\n'
      break
    case 'medium':
      recommendations += '• ควรดำเนินการภายใน 3-5 วัน\n'
      recommendations += '• จัดลำดับความสำคัญ\n'
      recommendations += '• ตรวจสอบงบประมาณ\n'
      break
    case 'low':
      recommendations += '• สามารถดำเนินการตามปกติ\n'
      recommendations += '• จัดตารางงานประจำ\n'
      recommendations += '• ตรวจสอบคุณภาพงาน\n'
      break
  }
  
  // Category-specific recommendations
  if (category.includes('ไฟฟ้า')) {
    recommendations += '• ตรวจสอบความปลอดภัยก่อนดำเนินการ\n'
  } else if (category.includes('น้ำ')) {
    recommendations += '• ปิดวาล์วน้ำก่อนซ่อมแซม\n'
  }
  
  return recommendations
}

const getEstimatedTime = (priority: string): string => {
  switch (priority) {
    case 'high': return '2-4 ชั่วโมง'
    case 'medium': return '1-2 วัน'
    case 'low': return '3-5 วัน'
    default: return 'ไม่ระบุ'
  }
}

// Statistics and Analytics
export const calculateStats = (requests: RepairRequest[]) => {
  const total = requests.length
  const pending = requests.filter(r => r.status === 'pending').length
  const inProgress = requests.filter(r => r.status === 'in-progress').length
  const completed = requests.filter(r => r.status === 'completed').length
  const critical = requests.filter(r => r.priority === 'high' && r.status !== 'completed').length
  
  const avgResponseTime = calculateAverageResponseTime(requests)
  
  return {
    totalRequests: total,
    pendingRequests: pending,
    inProgressRequests: inProgress,
    completedRequests: completed,
    criticalIssues: critical,
    averageResponseTime: avgResponseTime
  }
}

const calculateAverageResponseTime = (requests: RepairRequest[]): number => {
  const completedRequests = requests.filter(r => r.status === 'completed')
  if (completedRequests.length === 0) return 0
  
  const totalTime = completedRequests.reduce((sum, request) => {
    const responseTime = request.updatedAt.getTime() - request.createdAt.getTime()
    return sum + responseTime
  }, 0)
  
  return Math.round(totalTime / completedRequests.length / (1000 * 60 * 60)) // hours
} 