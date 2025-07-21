"use client"
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import i18n from '../utils/i18n'
import { LangContext } from '../layout'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<'admin' | 'technician'>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [resetError, setResetError] = useState('')
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      return
    }
    // ตรวจสอบ role จาก user_metadata หรือ query จาก table users
    // สมมุติว่า admin ใช้ email admin@kkrdc.com
    if (role === 'admin' && email === 'admin@kkrdc.com') {
      router.push('/admin')
    } else {
      router.push('/technician')
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetMsg('')
    setResetError('')
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: window.location.origin + '/login' })
    if (error) setResetError('ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้')
    else setResetMsg('ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{i18n[lang].loginTitle || 'เข้าสู่ระบบ'}</h1>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setRole('admin')}
          >
            👨‍💼 {i18n[lang].admin || 'Admin'}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${role === 'technician' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setRole('technician')}
          >
            🔧 {i18n[lang].technician || 'ช่าง'}
          </button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{i18n[lang].password || 'รหัสผ่าน'}</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{i18n[lang].loginError || error}</div>}
          <div className="flex justify-end">
            <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => setShowReset(true)}>
              {i18n[lang].forgotPassword || 'ลืมรหัสผ่าน?'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all mt-2"
            disabled={loading}
          >
            {loading ? i18n[lang].loggingIn || 'กำลังเข้าสู่ระบบ...' : i18n[lang].login || 'เข้าสู่ระบบ'}
          </button>
        </form>
        {showReset && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleResetPassword} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{i18n[lang].resetPassword || 'รีเซ็ตรหัสผ่าน'}</h2>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input type="email" className="input-primary w-full" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
              </div>
              {resetError && <div className="text-red-600 mb-2">{i18n[lang].resetError || resetError}</div>}
              {resetMsg && <div className="text-green-600 mb-2">{i18n[lang].resetSent || resetMsg}</div>}
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-secondary" onClick={() => setShowReset(false)}>{i18n[lang].cancel || 'ยกเลิก'}</button>
                <button type="submit" className="btn-primary">{i18n[lang].sendReset || 'ส่งอีเมลรีเซ็ต'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
} 