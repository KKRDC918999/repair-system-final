"use client"
import { useEffect, useState, useContext } from 'react'
import { supabase } from '../utils/supabaseClient'
import i18n from '../utils/i18n'
import { LangContext } from '../layout'

interface RepairRequest {
  id: string
  title: string
  description: string
  location: string
  priority: string
  status: string
  category: string
  department: string
  requester: string
  phone: string
  assigned_to?: string
  image_url?: string
  created_at: string
  updated_at?: string
}

export default function TechnicianPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kpi, setKpi] = useState({ total: 0, completed: 0, avgHour: 0 })
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePassError, setChangePassError] = useState('')
  const [changePassSuccess, setChangePassSuccess] = useState('')
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  useEffect(() => {
    // ดึง user id จาก session
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        fetchRequests(data.user.id)
      }
    })
  }, [])

  async function fetchRequests(uid: string) {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('assigned_to', uid)
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) setError('โหลดรายการล้มเหลว')
    else {
      setRequests(data as RepairRequest[])
      calcKpi(data as RepairRequest[])
    }
  }

  async function updateStatus(id: string, status: string) {
    setLoading(true)
    const { error } = await supabase
      .from('repair_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    setLoading(false)
    if (error) setError('อัพเดทสถานะล้มเหลว')
    else fetchRequests(userId)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setChangePassError('')
    setChangePassSuccess('')
    if (newPassword !== confirmPassword) {
      setChangePassError('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setChangePassError('เปลี่ยนรหัสผ่านล้มเหลว')
    else setChangePassSuccess('เปลี่ยนรหัสผ่านสำเร็จ')
    setNewPassword('')
    setConfirmPassword('')
    setShowChangePassword(false)
  }

  function calcKpi(list: RepairRequest[]) {
    const total = list.length
    const completed = list.filter(r => r.status === 'completed').length
    const completedList = list.filter(r => r.status === 'completed' && r.updated_at)
    let avgHour = 0
    if (completedList.length > 0) {
      const sum = completedList.reduce((acc, r) => acc + ((new Date(r.updated_at!).getTime() - new Date(r.created_at).getTime()) / 3600000), 0)
      avgHour = Math.round(sum / completedList.length)
    }
    setKpi({ total, completed, avgHour })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 mb-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard ช่าง</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold">{kpi.total}</div>
            <div className="text-gray-700">งานทั้งหมด</div>
          </div>
          <div className="bg-green-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold">{kpi.completed}</div>
            <div className="text-gray-700">งานที่เสร็จ</div>
          </div>
          <div className="bg-yellow-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold">{kpi.avgHour}</div>
            <div className="text-gray-700">SLA (ชม. เฉลี่ย)</div>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <button className="btn-secondary" type="button" onClick={() => setShowChangePassword(true)}>{i18n[lang].changePassword || 'เปลี่ยนรหัสผ่าน'}</button>
        </div>
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleChangePassword} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h2>
              <div className="mb-4">
                <label className="block mb-1">รหัสผ่านใหม่</label>
                <input type="password" className="input-primary w-full" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">ยืนยันรหัสผ่านใหม่</label>
                <input type="password" className="input-primary w-full" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              {changePassError && <div className="text-red-600 mb-2">{changePassError}</div>}
              {changePassSuccess && <div className="text-green-600 mb-2">{changePassSuccess}</div>}
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-secondary" onClick={() => setShowChangePassword(false)}>{i18n[lang].cancel || 'ยกเลิก'}</button>
                <button type="submit" className="btn-primary">{i18n[lang].save || 'บันทึก'}</button>
              </div>
            </form>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].myJobs || 'งานที่ได้รับมอบหมาย'}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">หัวข้อ</th>
                <th className="px-4 py-2 border">รายละเอียด</th>
                <th className="px-4 py-2 border">สถานที่</th>
                <th className="px-4 py-2 border">สถานะ</th>
                <th className="px-4 py-2 border">เร่งด่วน</th>
                <th className="px-4 py-2 border">อัพเดทสถานะ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-2 border">{r.title}</td>
                  <td className="px-4 py-2 border">{r.description}</td>
                  <td className="px-4 py-2 border">{r.location}</td>
                  <td className="px-4 py-2 border">{r.status}</td>
                  <td className="px-4 py-2 border">{r.priority}</td>
                  <td className="px-4 py-2 border">
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="input-primary">
                      <option value="pending">รอดำเนินการ</option>
                      <option value="in-progress">กำลังดำเนินการ</option>
                      <option value="completed">เสร็จสิ้น</option>
                      <option value="cancelled">ยกเลิก</option>
                    </select>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4">ไม่มีงานที่ได้รับมอบหมาย</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  )
} 