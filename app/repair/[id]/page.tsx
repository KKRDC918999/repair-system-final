"use client"
import { useEffect, useState, useContext } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'
import i18n from '../../utils/i18n'
import { LangContext } from '../../layout'

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
interface Comment {
  id: string
  request_id: string
  user_id: string
  user_role: string
  message: string
  created_at: string
}

export default function RepairDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [request, setRequest] = useState<RepairRequest | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  useEffect(() => {
    fetchRequest()
    fetchComments()
    // Subscribe realtime
    const sub = supabase
      .channel('comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `request_id=eq.${id}` }, payload => {
        fetchComments()
      })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [id])

  async function fetchRequest() {
    const { data, error } = await supabase.from('repair_requests').select('*').eq('id', id).single()
    if (!error) setRequest(data as RepairRequest)
  }
  async function fetchComments() {
    const { data, error } = await supabase.from('comments').select('*').eq('request_id', id).order('created_at', { ascending: true })
    if (!error) setComments(data as Comment[])
  }
  async function handleSendComment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    // TODO: ดึง user_id, user_role จาก session จริง
    const user_id = 'demo-user'
    const user_role = 'admin'
    const { error } = await supabase.from('comments').insert([
      { request_id: id, user_id, user_role, message: newComment }
    ])
    setLoading(false)
    if (error) setError('ส่งข้อความล้มเหลว')
    else setNewComment('')
  }

  if (!request) return <div className="p-8">กำลังโหลด...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 mb-8">
        <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
        <div className="mb-2 text-gray-600">{request.description}</div>
        <div className="mb-2">{i18n[lang].location || 'สถานที่'}: {request.location}</div>
        <div className="mb-2">{i18n[lang].department || 'แผนก'}: {request.department}</div>
        <div className="mb-2">{i18n[lang].requester || 'ผู้แจ้ง'}: {request.requester} ({request.phone})</div>
        <div className="mb-2">{i18n[lang].status || 'สถานะ'}: {request.status}</div>
        <div className="mb-2">{i18n[lang].priority || 'เร่งด่วน'}: {request.priority}</div>
        <div className="mb-2">{i18n[lang].category || 'หมวดหมู่'}: {request.category}</div>
        {request.image_url && <img src={request.image_url} alt="img" className="h-32 my-4 rounded" />}
        <div className="mb-2 text-gray-400 text-sm">{i18n[lang].createdAt || 'แจ้งเมื่อ'}: {request.created_at?.slice(0, 16).replace('T', ' ')}</div>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-xl font-semibold mb-4">{i18n[lang].commentChat || 'คอมเมนต์/แชท'}</h2>
        <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
          {comments.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-lg p-3 border">
              <div className="text-sm text-gray-700">{c.user_role}: {c.message}</div>
              <div className="text-xs text-gray-400 mt-1">{i18n[lang].createdAt || 'แจ้งเมื่อ'}: {c.created_at?.slice(0, 16).replace('T', ' ')}</div>
            </div>
          ))}
          {comments.length === 0 && <div className="text-gray-400">{i18n[lang].noComment || 'ยังไม่มีข้อความ'}</div>}
        </div>
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input type="text" className="input-primary flex-1" placeholder={i18n[lang].typeMessage || 'พิมพ์ข้อความ...'} value={newComment} onChange={e => setNewComment(e.target.value)} required disabled={loading} />
          <button type="submit" className="btn-primary" disabled={loading || !newComment}>{loading ? i18n[lang].sending || 'กำลังส่ง...' : i18n[lang].send || 'ส่ง'}</button>
        </form>
        {error && <div className="text-red-600 mt-2">{i18n[lang].sendError || error}</div>}
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <button className="btn-secondary" onClick={() => router.back()}>{i18n[lang].back || 'ย้อนกลับ'}</button>
      </div>
    </div>
  )
} 