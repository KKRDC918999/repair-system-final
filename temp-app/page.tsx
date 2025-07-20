'use client'

import { useState } from 'react'

export interface RepairRequest {
  id: string
  title: string
  description: string
  location: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  category: string
  requester: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export default function Home() {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([
    {
      id: '1',
      title: 'แอร์คอนดิชันไม่เย็น',
      description: 'แอร์คอนดิชันในห้องประชุมไม่เย็น ต้องตรวจสอบและซ่อมแซม',
      location: 'ห้องประชุมใหญ่ ชั้น 2',
      priority: 'high',
      status: 'pending',
      category: 'ระบบปรับอากาศ',
      requester: 'คุณสมชาย ใจดี',
      phone: '081-234-5678',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'ไฟในห้องน้ำเสีย',
      description: 'ไฟในห้องน้ำชายไม่ติด ต้องเปลี่ยนหลอดไฟ',
      location: 'ห้องน้ำชาย ชั้น 1',
      priority: 'medium',
      status: 'in-progress',
      category: 'ระบบไฟฟ้า',
      requester: 'คุณสมหญิง รักดี',
      phone: '082-345-6789',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      title: 'ประตูเปิดปิดยาก',
      description: 'ประตูห้องทำงานเปิดปิดยาก ต้องปรับแต่งบานพับ',
      location: 'ห้องทำงาน หัวหน้าฝ่าย',
      priority: 'low',
      status: 'completed',
      category: 'งานไม้',
      requester: 'คุณสมศักดิ์ มั่นคง',
      phone: '083-456-7890',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '4',
      title: 'เครื่องถ่ายเอกสารเสีย',
      description: 'เครื่องถ่ายเอกสารในห้องสำนักงานพิมพ์ไม่ชัด ต้องเปลี่ยนหมึก',
      location: 'ห้องสำนักงาน ชั้น 1',
      priority: 'medium',
      status: 'pending',
      category: 'อุปกรณ์สำนักงาน',
      requester: 'คุณสมปอง ใจเย็น',
      phone: '084-567-8901',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: '5',
      title: 'น้ำรั่วจากท่อ',
      description: 'น้ำรั่วจากท่อในห้องครัว ต้องซ่อมแซมทันที',
      location: 'ห้องครัว ชั้น 1',
      priority: 'high',
      status: 'in-progress',
      category: 'ระบบน้ำ',
      requester: 'คุณสมศรี รักสะอาด',
      phone: '085-678-9012',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-18')
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusCount = (status: string) => {
    return repairRequests.filter(request => request.status === status).length
  }

  const filteredRequests = repairRequests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requester.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updateStatus = (id: string, newStatus: RepairRequest['status']) => {
    setRepairRequests(repairRequests.map(request => 
      request.id === id 
        ? { ...request, status: newStatus, updatedAt: new Date() }
        : request
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ระบบแจ้งซ่อม KKRDC</h1>
                <p className="text-blue-100">ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
              >
                👨‍💼 Admin
              </a>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all font-semibold"
              >
                ✨ แจ้งซ่อมใหม่
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('pending')}</p>
                <p className="text-xs text-yellow-600">ต้องจัดการ</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('in-progress')}</p>
                <p className="text-xs text-blue-600">กำลังซ่อม</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('completed')}</p>
                <p className="text-xs text-green-600">สำเร็จ</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{repairRequests.length}</p>
                <p className="text-xs text-purple-600">รายการ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="ค้นหาการแจ้งซ่อม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Repair List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              รายการแจ้งซ่อม
            </h2>
            <p className="text-gray-600 mt-1">พบ {filteredRequests.length} รายการ</p>
          </div>
          <div className="p-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">ไม่พบรายการแจ้งซ่อม</p>
                <p className="text-gray-400">ลองเปลี่ยนคำค้นหา</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{request.title}</h3>
                          <span className="ml-3 text-sm text-gray-500">#{request.id}</span>
                        </div>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">📍</span>
                            <span className="text-gray-700">{request.location}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">👤</span>
                            <span className="text-gray-700">{request.requester}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">📞</span>
                            <span className="text-gray-700">{request.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="space-y-3">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            request.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            request.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {request.status === 'pending' ? '⏰ รอดำเนินการ' :
                             request.status === 'in-progress' ? '🔄 กำลังดำเนินการ' :
                             request.status === 'completed' ? '✅ เสร็จสิ้น' : '❌ ยกเลิก'}
                          </span>
                          <div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              request.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              {request.priority === 'high' ? '🚨 สูง' :
                               request.priority === 'medium' ? '⚠️ ปานกลาง' : '🟢 ต่ำ'}
                            </span>
                          </div>
                          <div>
                            <select
                              value={request.status}
                              onChange={(e) => updateStatus(request.id, e.target.value as RepairRequest['status'])}
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="pending">รอดำเนินการ</option>
                              <option value="in-progress">กำลังดำเนินการ</option>
                              <option value="completed">เสร็จสิ้น</option>
                              <option value="cancelled">ยกเลิก</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✨</span>
                <h2 className="text-xl font-bold">แจ้งซ่อมใหม่</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 หัวข้อปัญหา</label>
                  <input
                    type="text"
                    placeholder="เช่น แอร์คอนดิชันไม่เย็น, ไฟเสีย, น้ำรั่ว..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📝 รายละเอียด</label>
                  <textarea
                    placeholder="อธิบายรายละเอียดของปัญหาที่พบ..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📍 สถานที่</label>
                  <input
                    type="text"
                    placeholder="เช่น ห้องประชุมใหญ่ ชั้น 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🚨 ความเร่งด่วน</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">เลือกความเร่งด่วน</option>
                    <option value="low">🟢 ต่ำ - ไม่กระทบการทำงาน</option>
                    <option value="medium">🟡 ปานกลาง - กระทบบางส่วน</option>
                    <option value="high">🔴 สูง - กระทบการทำงานมาก</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">👤 ผู้แจ้ง</label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📞 เบอร์โทร</label>
                  <input
                    type="text"
                    placeholder="081-234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📋 หมวดหมู่</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="electrical">⚡ ระบบไฟฟ้า</option>
                    <option value="aircon">❄️ ระบบปรับอากาศ</option>
                    <option value="plumbing">🚰 ระบบน้ำ</option>
                    <option value="carpentry">🔨 งานไม้</option>
                    <option value="equipment">🖥️ อุปกรณ์สำนักงาน</option>
                    <option value="other">🔧 อื่นๆ</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
                >
                  ❌ ยกเลิก
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                >
                  ✅ บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 