"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

interface Department {
  id: string
  name: string
  code: string
  manager: string
  phone: string
  location: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [form, setForm] = useState({ name: '', code: '', manager: '', phone: '', location: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.from('departments').select('*').order('name')
    setLoading(false)
    if (error) setError('โหลดข้อมูลแผนกล้มเหลว')
    else setDepartments(data as Department[])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    if (editId) {
      // update
      const { error } = await supabase.from('departments').update(form).eq('id', editId)
      setLoading(false)
      if (error) setError('แก้ไขแผนกล้มเหลว')
      else {
        setSuccess('แก้ไขแผนกสำเร็จ')
        setForm({ name: '', code: '', manager: '', phone: '', location: '' })
        setEditId(null)
        fetchDepartments()
      }
    } else {
      // insert
      const { error } = await supabase.from('departments').insert([form])
      setLoading(false)
      if (error) setError('เพิ่มแผนกล้มเหลว')
      else {
        setSuccess('เพิ่มแผนกสำเร็จ')
        setForm({ name: '', code: '', manager: '', phone: '', location: '' })
        fetchDepartments()
      }
    }
  }

  async function handleEdit(dept: Department) {
    setEditId(dept.id)
    setForm({ name: dept.name, code: dept.code, manager: dept.manager, phone: dept.phone, location: dept.location })
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบแผนกนี้จริงหรือไม่?')) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('departments').delete().eq('id', id)
    setLoading(false)
    if (error) setError('ลบแผนกล้มเหลว')
    else fetchDepartments()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6">จัดการแผนก</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="ชื่อแผนก" className="input-primary" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input type="text" placeholder="รหัสแผนก" className="input-primary" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
          <input type="text" placeholder="ผู้จัดการ" className="input-primary" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} />
          <input type="text" placeholder="เบอร์โทร" className="input-primary" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <input type="text" placeholder="สถานที่" className="input-primary" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <button type="submit" className="btn-primary col-span-1 md:col-span-2" disabled={loading}>{editId ? 'บันทึกการแก้ไข' : 'เพิ่มแผนก'}</button>
        </form>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <h2 className="text-xl font-semibold mb-4">รายการแผนก</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">ชื่อแผนก</th>
                <th className="px-4 py-2 border">รหัส</th>
                <th className="px-4 py-2 border">ผู้จัดการ</th>
                <th className="px-4 py-2 border">เบอร์โทร</th>
                <th className="px-4 py-2 border">สถานที่</th>
                <th className="px-4 py-2 border">แก้ไข</th>
                <th className="px-4 py-2 border">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id}>
                  <td className="px-4 py-2 border">{dept.name}</td>
                  <td className="px-4 py-2 border">{dept.code}</td>
                  <td className="px-4 py-2 border">{dept.manager}</td>
                  <td className="px-4 py-2 border">{dept.phone}</td>
                  <td className="px-4 py-2 border">{dept.location}</td>
                  <td className="px-4 py-2 border text-center"><button onClick={() => handleEdit(dept)} className="text-blue-600 hover:underline">แก้ไข</button></td>
                  <td className="px-4 py-2 border text-center"><button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline">ลบ</button></td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4">ไม่มีข้อมูลแผนก</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 