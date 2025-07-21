"use client"
import { useEffect, useState, useContext } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import i18n from '../utils/i18n'
import { LangContext } from '../layout'

interface Technician {
  id: string
  email: string
  name: string
  department: string
  created_at: string
}
interface RepairRequest {
  id: string
  title: string
  status: string
  assigned_to?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<Technician[]>([])
  const [form, setForm] = useState({ email: '', password: '', name: '', department: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([])
  const [assigning, setAssigning] = useState<{ requestId: string, techId: string }>({ requestId: '', techId: '' })
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePassError, setChangePassError] = useState('')
  const [changePassSuccess, setChangePassSuccess] = useState('')
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  // โหลด user ช่างทั้งหมด
  useEffect(() => {
    fetchUsers()
    fetchRepairRequests()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'technician')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) setError('โหลดรายชื่อช่างล้มเหลว')
    else setUsers(data as Technician[])
  }

  async function fetchRepairRequests() {
    const { data, error } = await supabase
      .from('repair_requests')
      .select('id, title, status, assigned_to')
      .order('created_at', { ascending: false })
    if (!error) setRepairRequests(data as RepairRequest[])
  }

  async function handleAssign(requestId: string, techId: string) {
    setLoading(true)
    setError('')
    const { error } = await supabase
      .from('repair_requests')
      .update({ assigned_to: techId })
      .eq('id', requestId)
    setLoading(false)
    if (error) setError('มอบหมายงานล้มเหลว')
    else {
      setSuccess('มอบหมายงานสำเร็จ')
      fetchRepairRequests()
    }
  }

  // สร้าง user ช่างใหม่
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    // สร้าง user ใน Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: form.email,
      password: form.password,
      user_metadata: { name: form.name, department: form.department, role: 'technician' },
    })
    if (authError) {
      setError('สร้าง user ล้มเหลว: ' + authError.message)
      setLoading(false)
      return
    }
    // เพิ่มข้อมูลลง table users
    const { error: dbError } = await supabase.from('users').insert([
      {
        id: authData.user?.id,
        email: form.email,
        name: form.name,
        department: form.department,
        role: 'technician',
      },
    ])
    setLoading(false)
    if (dbError) setError('บันทึก user ใน database ล้มเหลว')
    else {
      setSuccess('สร้าง user สำเร็จ')
      setForm({ email: '', password: '', name: '', department: '' })
      fetchUsers()
    }
  }

  // ลบ user
  async function handleDeleteUser(id: string) {
    if (!confirm('ต้องการลบ user นี้จริงหรือไม่?')) return
    setLoading(true)
    setError('')
    // ลบจาก table users
    const { error } = await supabase.from('users').delete().eq('id', id)
    setLoading(false)
    if (error) setError('ลบ user ล้มเหลว')
    else fetchUsers()
  }

  // Export CSV
  function handleExportCSV() {
    const csv = Papa.unparse(repairRequests)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'repair_requests.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Import CSV
  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        const rows = results.data
        for (const row of rows) {
          if (!row.id) continue
          await supabase.from('repair_requests').upsert([row], { onConflict: 'id' })
        }
        fetchRepairRequests()
        setSuccess('นำเข้าข้อมูลสำเร็จ')
      },
      error: () => setError('นำเข้าข้อมูลล้มเหลว')
    })
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
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowChangePassword(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex space-x-4 mb-8">
          <button onClick={() => router.push('/')} className="btn-secondary">🏠 หน้าหลัก</button>
          <button onClick={() => router.push('/report')} className="btn-secondary">📊 รายงาน KPI/SLA</button>
          <button onClick={() => router.push('/departments')} className="btn-secondary">🏢 แผนก</button>
          <button onClick={() => router.push('/repair')} className="btn-secondary">🔧 แจ้งซ่อม</button>
        </div>
        <div className="flex gap-4 mb-6">
          <button className="btn-primary" onClick={handleExportCSV} type="button">{i18n[lang].exportCSV || 'Export CSV'}</button>
          <label className="btn-secondary cursor-pointer">
            {i18n[lang].importCSV || 'Import CSV'}
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
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
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].addUser || 'สร้าง user ช่างใหม่'}</h2>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="email" placeholder="Email" className="input-primary" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <input type="password" placeholder="Password" className="input-primary" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          <input type="text" placeholder="ชื่อช่าง" className="input-primary" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input type="text" placeholder="แผนก" className="input-primary" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          <button type="submit" className="btn-primary col-span-1 md:col-span-2" disabled={loading}>{loading ? 'กำลังสร้าง...' : 'สร้าง user ช่าง'}</button>
        </form>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].assignJob || 'มอบหมายงานให้ช่าง'}</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">หัวข้อ</th>
                <th className="px-4 py-2 border">สถานะ</th>
                <th className="px-4 py-2 border">ช่างที่รับผิดชอบ</th>
                <th className="px-4 py-2 border">มอบหมาย</th>
              </tr>
            </thead>
            <tbody>
              {repairRequests.map(req => (
                <tr key={req.id}>
                  <td className="px-4 py-2 border">{req.title}</td>
                  <td className="px-4 py-2 border">{req.status}</td>
                  <td className="px-4 py-2 border">{users.find(u => u.id === req.assigned_to)?.name || '-'}</td>
                  <td className="px-4 py-2 border">
                    <select
                      value={assigning.requestId === req.id ? assigning.techId : ''}
                      onChange={e => setAssigning({ requestId: req.id, techId: e.target.value })}
                      className="input-primary"
                    >
                      <option value="">เลือกช่าง</option>
                      {users.map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                      ))}
                    </select>
                    <button
                      className="ml-2 btn-secondary"
                      disabled={!assigning.techId || assigning.requestId !== req.id}
                      onClick={() => handleAssign(req.id, assigning.techId)}
                      type="button"
                    >
                      มอบหมาย
                    </button>
                  </td>
                </tr>
              ))}
              {repairRequests.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4">ไม่มีงานแจ้งซ่อม</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].userList || 'รายชื่อ user ช่าง'}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">ชื่อ</th>
                <th className="px-4 py-2 border">แผนก</th>
                <th className="px-4 py-2 border">สร้างเมื่อ</th>
                <th className="px-4 py-2 border">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.department}</td>
                  <td className="px-4 py-2 border">{user.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-2 border text-center">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:underline">ลบ</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4">ไม่มี user ช่าง</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 