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
}

export default function RepairPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: '',
    category: '',
    department: '',
    requester: '',
    phone: '',
    image: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('repair_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) setError('โหลดรายการแจ้งซ่อมล้มเหลว')
    else setRequests(data as RepairRequest[])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    let image_url = ''
    if (form.image) {
      const fileExt = form.image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('repair-uploads')
        .upload(fileName, form.image)
      if (uploadError) {
        setError('อัปโหลดรูปไม่สำเร็จ')
        setLoading(false)
        return
      }
      image_url = supabase.storage.from('repair-uploads').getPublicUrl(fileName).data.publicUrl
    }
    const { error: dbError } = await supabase.from('repair_requests').insert([
      {
        title: form.title,
        description: form.description,
        location: form.location,
        priority: form.priority,
        status: 'pending',
        category: form.category,
        department: form.department,
        requester: form.requester,
        phone: form.phone,
        image_url,
      },
    ])
    setLoading(false)
    if (dbError) setError('บันทึกข้อมูลล้มเหลว')
    else {
      setSuccess('แจ้งซ่อมสำเร็จ')
      setForm({ title: '', description: '', location: '', priority: '', category: '', department: '', requester: '', phone: '', image: null })
      fetchRequests()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 mb-8">
        <h1 className="text-2xl font-bold mb-6">{i18n[lang].repairTitle || 'แจ้งซ่อม'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="หัวข้อปัญหา" className="input-primary" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <textarea placeholder="รายละเอียด" className="input-primary" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          <input type="text" placeholder="สถานที่" className="input-primary" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          <input type="text" placeholder="หมวดหมู่" className="input-primary" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
          <input type="text" placeholder="แผนก" className="input-primary" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          <input type="text" placeholder="ชื่อผู้แจ้ง" className="input-primary" value={form.requester} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))} required />
          <input type="text" placeholder="เบอร์โทร" className="input-primary" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          <select className="input-primary" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} required>
            <option value="">เลือกความเร่งด่วน</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
          </select>
          <input type="file" accept="image/*" className="input-primary" onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'แจ้งซ่อม'}</button>
        </form>
        {error && <div className="text-red-600 mt-4">{error}</div>}
        {success && <div className="text-green-600 mt-4">{success}</div>}
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].repairList || 'รายการแจ้งซ่อม'}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">{i18n[lang].title || 'หัวข้อ'}</th>
                <th className="px-4 py-2 border">{i18n[lang].description || 'รายละเอียด'}</th>
                <th className="px-4 py-2 border">{i18n[lang].location || 'สถานที่'}</th>
                <th className="px-4 py-2 border">{i18n[lang].department || 'แผนก'}</th>
                <th className="px-4 py-2 border">{i18n[lang].requester || 'ผู้แจ้ง'}</th>
                <th className="px-4 py-2 border">{i18n[lang].image || 'รูป'}</th>
                <th className="px-4 py-2 border">{i18n[lang].status || 'สถานะ'}</th>
                <th className="px-4 py-2 border">{i18n[lang].priority || 'เร่งด่วน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].date || 'วันที่'}</th>
                <th className="px-4 py-2 border"> </th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-2 border">{r.title}</td>
                  <td className="px-4 py-2 border">{r.description}</td>
                  <td className="px-4 py-2 border">{r.location}</td>
                  <td className="px-4 py-2 border">{r.department}</td>
                  <td className="px-4 py-2 border">{r.requester}</td>
                  <td className="px-4 py-2 border text-center">{r.image_url && <img src={r.image_url} alt="img" className="h-12 mx-auto" />}</td>
                  <td className="px-4 py-2 border">{r.status}</td>
                  <td className="px-4 py-2 border">{r.priority}</td>
                  <td className="px-4 py-2 border">{r.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-2 border text-center">
                    <a href={`/repair/${r.id}`} className="btn-secondary text-xs">{i18n[lang].detail || 'ดูรายละเอียด'}</a>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={10} className="text-center py-4">{i18n[lang].noRepair || 'ไม่มีรายการแจ้งซ่อม'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 