'use client'

import { useState, useEffect } from 'react'

interface RepairRequest {
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

interface AdminStats {
  totalRequests: number
  pendingRequests: number
  inProgressRequests: number
  completedRequests: number
  averageResponseTime: number
  criticalIssues: number
}

export default function AdminPage() {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    averageResponseTime: 0,
    criticalIssues: 0
  })
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulate AI Analysis
  const analyzeWithAI = async (request: RepairRequest) => {
    setIsAnalyzing(true)
    setAiAnalysis('กำลังวิเคราะห์ด้วย AI...')
    
    // Simulate AI processing
    setTimeout(() => {
      const analysis = `
🤖 **การวิเคราะห์ด้วย AI**

**ระดับความเร่งด่วน**: ${request.priority === 'high' ? '🔴 สูงมาก' : request.priority === 'medium' ? '🟡 ปานกลาง' : '🟢 ต่ำ'}

**ประเภทปัญหา**: ${request.category}

**คำแนะนำ**:
${request.priority === 'high' ? '• ควรดำเนินการภายใน 24 ชั่วโมง\n• แจ้งเตือนทีมซ่อมบำรุงทันที\n• เตรียมอุปกรณ์สำรอง' : 
  request.priority === 'medium' ? '• ควรดำเนินการภายใน 3-5 วัน\n• จัดลำดับความสำคัญ\n• ตรวจสอบงบประมาณ' : 
  '• สามารถดำเนินการตามปกติ\n• จัดตารางงานประจำ\n• ตรวจสอบคุณภาพงาน'}

**ความเสี่ยง**: ${request.priority === 'high' ? 'สูง - อาจส่งผลต่อการทำงาน' : 'ต่ำ - ไม่กระทบการทำงานหลัก'}

**เวลาที่แนะนำ**: ${request.priority === 'high' ? '2-4 ชั่วโมง' : request.priority === 'medium' ? '1-2 วัน' : '3-5 วัน'}
      `
      setAiAnalysis(analysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  // Auto Error Detection
  const detectErrors = (request: RepairRequest) => {
    const errors = []
    
    if (!request.title.trim()) errors.push('❌ ไม่มีหัวข้อ')
    if (!request.description.trim()) errors.push('❌ ไม่มีรายละเอียด')
    if (!request.location.trim()) errors.push('❌ ไม่ระบุสถานที่')
    if (!request.requester.trim()) errors.push('❌ ไม่ระบุผู้แจ้ง')
    if (!request.phone.trim()) errors.push('❌ ไม่ระบุเบอร์โทร')
    
    if (request.priority === 'high' && request.status === 'pending') {
      errors.push('⚠️ ปัญหาความเร่งด่วนสูงยังไม่ได้รับการจัดการ')
    }
    
    return errors
  }

  // Auto Fix Suggestions
  const getAutoFixSuggestions = (request: RepairRequest) => {
    const suggestions = []
    
    if (!request.title.trim()) {
      suggestions.push('🔧 แนะนำ: เพิ่มหัวข้อที่ชัดเจน')
    }
    
    if (request.priority === 'high' && request.status === 'pending') {
      suggestions.push('🔧 แนะนำ: เปลี่ยนสถานะเป็น "กำลังดำเนินการ"')
    }
    
    if (request.description.length < 10) {
      suggestions.push('🔧 แนะนำ: เพิ่มรายละเอียดให้ครบถ้วน')
    }
    
    return suggestions
  }

  // ฟังก์ชัน Export ข้อมูลแจ้งซ่อม
  const exportRepairRequests = () => {
    if (typeof window === 'undefined') return
    const data = localStorage.getItem('repair_requests')
    if (!data) {
      alert('ไม่พบข้อมูล')
      return
    }
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'repair_requests_export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-100">ระบบจัดการแจ้งซ่อมขั้นสูง</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">🕒 {new Date().toLocaleString('th-TH')}</span>
              </div>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all">
                🔔 แจ้งเตือน
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ปัญหาวิกฤต</p>
                <p className="text-2xl font-bold text-gray-900">{stats.criticalIssues}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={exportRepairRequests}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
          >
            ⬇️ Export ข้อมูลแจ้งซ่อม
          </button>
        </div>

        {/* AI Analysis Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI Analysis
            </h2>
            {selectedRequest ? (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900">{selectedRequest.title}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                </div>
                
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">กำลังวิเคราะห์...</span>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">{aiAnalysis}</pre>
                  </div>
                )}
                
                <button
                  onClick={() => analyzeWithAI(selectedRequest)}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  🔄 วิเคราะห์ใหม่
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">เลือกรายการเพื่อวิเคราะห์ด้วย AI</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🔧</span>
              Auto Error Detection
            </h2>
            {selectedRequest ? (
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ข้อผิดพลาดที่พบ:</h4>
                    {detectErrors(selectedRequest).length > 0 ? (
                      <ul className="space-y-1">
                        {detectErrors(selectedRequest).map((error, index) => (
                          <li key={index} className="text-red-600 text-sm">• {error}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-600 text-sm">✅ ไม่พบข้อผิดพลาด</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">คำแนะนำอัตโนมัติ:</h4>
                    {getAutoFixSuggestions(selectedRequest).length > 0 ? (
                      <ul className="space-y-1">
                        {getAutoFixSuggestions(selectedRequest).map((suggestion, index) => (
                          <li key={index} className="text-blue-600 text-sm">• {suggestion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-600 text-sm">✅ ข้อมูลครบถ้วน</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">เลือกรายการเพื่อตรวจสอบข้อผิดพลาด</p>
            )}
          </div>
        </div>

        {/* Request List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">รายการแจ้งซ่อมทั้งหมด</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {repairRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedRequest?.id === request.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📍 {request.location}</span>
                        <span>👤 {request.requester}</span>
                        <span>📞 {request.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' ? 'รอดำเนินการ' :
                         request.status === 'in-progress' ? 'กำลังดำเนินการ' :
                         request.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                      </span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.priority === 'high' ? 'bg-red-100 text-red-800' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority === 'high' ? 'สูง' :
                           request.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 