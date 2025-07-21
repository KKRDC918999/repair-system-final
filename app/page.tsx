'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { RepairDatabase } from './utils/database'
import { supabase } from './utils/supabaseClient'
import i18n from './utils/i18n'
import { LangContext } from './layout'
import { Bar } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface RepairRequest {
  id: string
  title: string
  description: string
  location: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  category: string
  department: string
  requester: string
  phone: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

interface Department {
  id: string
  name: string
  code: string
  manager: string
  phone: string
  location: string
  requestCount: number
}

export default function HomePage() {
  const router = useRouter()
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([
    {
      id: '1',
      title: 'แอร์คอนดิชันไม่เย็น',
      description: 'แอร์คอนดิชันในห้องประชุมไม่เย็น ต้องตรวจสอบและซ่อมแซม',
      location: 'ห้องประชุมใหญ่ ชั้น 2',
      priority: 'high',
      status: 'pending',
      category: 'ระบบปรับอากาศ',
      department: 'IT',
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
      department: 'HR',
      requester: 'คุณสมหญิง รักดี',
      phone: '082-345-6789',
      assignedTo: 'ช่างไฟฟ้า-001',
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
      department: 'Finance',
      requester: 'คุณสมศักดิ์ มั่นคง',
      phone: '083-456-7890',
      assignedTo: 'ช่างไม้-002',
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
      department: 'Marketing',
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
      department: 'Operations',
      requester: 'คุณสมศรี รักสะอาด',
      phone: '085-678-9012',
      assignedTo: 'ช่างประปา-003',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-18')
    }
  ])

  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'แผนกเทคโนโลยีสารสนเทศ',
      code: 'IT',
      manager: 'คุณสมชาย ใจดี',
      phone: '081-234-5678',
      location: 'ชั้น 3 อาคาร A',
      requestCount: 15
    },
    {
      id: '2',
      name: 'แผนกทรัพยากรบุคคล',
      code: 'HR',
      manager: 'คุณสมหญิง รักดี',
      phone: '082-345-6789',
      location: 'ชั้น 2 อาคาร B',
      requestCount: 8
    },
    {
      id: '3',
      name: 'แผนกการเงิน',
      code: 'Finance',
      manager: 'คุณสมศักดิ์ มั่นคง',
      phone: '083-456-7890',
      location: 'ชั้น 1 อาคาร A',
      requestCount: 12
    },
    {
      id: '4',
      name: 'แผนกการตลาด',
      code: 'Marketing',
      manager: 'คุณสมปอง ใจเย็น',
      phone: '084-567-8901',
      location: 'ชั้น 2 อาคาร A',
      requestCount: 6
    },
    {
      id: '5',
      name: 'แผนกปฏิบัติการ',
      code: 'Operations',
      manager: 'คุณสมศรี รักสะอาด',
      phone: '085-678-9012',
      location: 'ชั้น 1 อาคาร B',
      requestCount: 20
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginType, setLoginType] = useState<'admin' | 'technician'>('admin')
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })

  // เพิ่ม state สำหรับฟอร์มแจ้งซ่อมใหม่
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: '',
    department: '',
    requester: '',
    phone: '',
    category: '',
  })

  const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, done: 0, avgSla: 0 })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchStats()
  }, [])
  async function fetchStats() {
    setLoading(true)
    const { data, error } = await supabase.from('repair_requests').select('*')
    setLoading(false)
    if (!error && data) {
      const total = data.length
      const pending = data.filter((r: any) => r.status === 'pending').length
      const inprogress = data.filter((r: any) => r.status === 'in-progress').length
      const done = data.filter((r: any) => r.status === 'completed').length
      // KPI/SLA: เวลาระหว่าง created_at กับ updated_at เฉพาะที่ done
      const slaList = data.filter((r: any) => r.status === 'completed' && r.created_at && r.updated_at)
        .map((r: any) => (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()) / 3600000)
      const avgSla = slaList.length ? (slaList.reduce((a: number, b: number) => a + b, 0) / slaList.length) : 0
      setStats({ total, pending, inprogress, done, avgSla })
    }
  }

  const getStatusCount = (status: RepairRequest['status']) => {
    return repairRequests.filter(request => request.status === status).length
  }

  const filteredRequests = repairRequests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updateStatus = (id: string, newStatus: RepairRequest['status']) => {
    setRepairRequests(repairRequests.map(request => 
      request.id === id 
        ? { ...request, status: newStatus, updatedAt: new Date() }
        : request
    ))
  }

  const handleLogin = () => {
    if (loginType === 'admin') {
      if (loginCredentials.username === 'admin' && loginCredentials.password === 'abss@1234') {
        router.push('/admin')
      } else {
        alert('รหัสผ่านไม่ถูกต้อง')
      }
    } else {
      // Technician login - redirect to technician dashboard
      router.push('/technician')
    }
    setShowLogin(false)
    setLoginCredentials({ username: '', password: '' })
  }

  // ฟังก์ชันบันทึกข้อมูลแจ้งซ่อมใหม่
  const handleSaveRequest = () => {
    if (!form.title || !form.description || !form.location || !form.priority || !form.department || !form.requester || !form.phone) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    const newRequest: RepairRequest = {
      ...form,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: '',
      priority: form.priority as 'high' | 'medium' | 'low',
      category: form.category || 'อื่นๆ',
      department: form.department,
    }
    setRepairRequests([...repairRequests, newRequest])
    RepairDatabase.addRequest({
      title: newRequest.title,
      description: newRequest.description,
      location: newRequest.location,
      priority: newRequest.priority,
      status: newRequest.status,
      category: newRequest.category,
      requester: newRequest.requester,
      phone: newRequest.phone,
      department: newRequest.department,
      assignedTo: newRequest.assignedTo,
    })
    setShowForm(false)
    setForm({ title: '', description: '', location: '', priority: '', department: '', requester: '', phone: '', category: '' })
  }

  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  const chartData = {
    labels: [i18n[lang].pending, i18n[lang].inprogress, i18n[lang].done],
    datasets: [
      {
        label: i18n[lang].total,
        data: [stats.pending, stats.inprogress, stats.done],
        backgroundColor: [
          'rgba(251,191,36,0.7)', // yellow
          'rgba(99,102,241,0.7)', // indigo
          'rgba(34,197,94,0.7)',  // green
        ],
        borderRadius: 8,
      },
    ],
  }
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: i18n[lang].dashboard },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }

  const pieData = {
    labels: [i18n[lang].pending, i18n[lang].inprogress, i18n[lang].done],
    datasets: [
      {
        data: [stats.pending, stats.inprogress, stats.done],
        backgroundColor: [
          'rgba(251,191,36,0.7)', // yellow
          'rgba(99,102,241,0.7)', // indigo
          'rgba(34,197,94,0.7)',  // green
        ],
        borderWidth: 1,
      },
    ],
  }
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: i18n[lang].status + ' (%)' },
    },
  }

  // Monthly trend data
  const [repairRequests, setRepairRequests] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<{ label: string, count: number }[]>([])
  useEffect(() => {
    fetchMonthly()
  }, [])
  async function fetchMonthly() {
    const { data, error } = await supabase.from('repair_requests').select('created_at')
    if (!error && data) {
      setRepairRequests(data)
      const monthMap: { [key: string]: number } = {}
      data.forEach((r: any) => {
        const d = new Date(r.created_at)
        const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
        monthMap[label] = (monthMap[label] || 0) + 1
      })
      const arr = Object.entries(monthMap).sort().map(([label, count]) => ({ label, count }))
      setMonthlyData(arr)
    }
  }

  const lineData = {
    labels: monthlyData.map(m => m.label),
    datasets: [
      {
        label: i18n[lang].total,
        data: monthlyData.map(m => m.count),
        borderColor: 'rgba(59,130,246,1)',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  }
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: i18n[lang].monthlyTrend || 'แนวโน้มงานซ่อมรายเดือน' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
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
              <button
                onClick={() => { setLoginType('admin'); setShowLogin(true) }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
              >
                👨‍💼 Admin Login
              </button>
              <button
                onClick={() => { setLoginType('technician'); setShowLogin(true) }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
              >
                🔧 ช่าง Login
              </button>
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

      {/* Dashboard รวม */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">{stats.total}</div>
          <div className="text-gray-600 dark:text-gray-200 mt-2">{i18n[lang as 'th' | 'en'].total}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-gray-600 dark:text-gray-200 mt-2">{i18n[lang as 'th' | 'en'].pending}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-indigo-500">{stats.inprogress}</div>
          <div className="text-gray-600 dark:text-gray-200 mt-2">{i18n[lang as 'th' | 'en'].inprogress}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-green-600">{stats.done}</div>
          <div className="text-gray-600 dark:text-gray-200 mt-2">{i18n[lang as 'th' | 'en'].done}</div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{stats.avgSla.toFixed(2)} {i18n[lang].hours}</div>
          <div className="text-gray-600 dark:text-gray-200 mt-2">{i18n[lang].avgSla}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
          <Bar data={chartData} options={chartOptions} className="w-full" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center md:col-span-2">
          <Pie data={pieData} options={pieOptions} className="w-full max-w-xs" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center md:col-span-2">
          <Line data={lineData} options={lineOptions} className="w-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
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

        {/* Departments Section */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🏢</span>
              แผนกต่างๆ
            </h2>
            <p className="text-gray-600 mt-1">ข้อมูลแผนกและจำนวนการแจ้งซ่อม</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div key={dept.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{dept.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {dept.code}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">👤</span>
                      <span>{dept.manager}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">📞</span>
                      <span>{dept.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">📍</span>
                      <span>{dept.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">📋</span>
                      <span>การแจ้งซ่อม: {dept.requestCount} รายการ</span>
                    </div>
                  </div>
                </div>
              ))}
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
                          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {request.department}
                          </span>
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
                        {request.assignedTo && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-400 mr-2">🔧</span>
                            <span className="text-blue-600 font-medium">มอบหมายให้: {request.assignedTo}</span>
                          </div>
                        )}
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

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {loginType === 'admin' ? '👨‍💼' : '🔧'}
                </span>
                <h2 className="text-xl font-bold">
                  {loginType === 'admin' ? 'Admin Login' : 'ช่าง Login'}
                </h2>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {loginType === 'admin' ? 'Username' : 'รหัสช่าง'}
                  </label>
                  <input
                    type="text"
                    value={loginCredentials.username}
                    onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                    placeholder={loginType === 'admin' ? 'admin' : 'รหัสช่าง'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่าน</label>
                  <input
                    type="password"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                    placeholder="รหัสผ่าน"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogin(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
                >
                  ❌ ยกเลิก
                </button>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                >
                  ✅ เข้าสู่ระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 แผนก</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">เลือกแผนก</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
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
                  onClick={handleSaveRequest}
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