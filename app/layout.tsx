import type { Metadata } from 'next'
import './globals.css'
import { supabase } from './utils/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState, useEffect, createContext, useContext } from 'react'

export const LangContext = createContext<{ lang: string, setLang: (l: string) => void }>({ lang: 'th', setLang: () => {} })

function LanguageToggle() {
  const { lang, setLang } = useContext(LangContext)
  return (
    <select value={lang} onChange={e => setLang(e.target.value)} className="ml-2 px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
      <option value="th">ไทย</option>
      <option value="en">English</option>
    </select>
  )
}

function LogoutButton() {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <button onClick={handleLogout} className="ml-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">Logout</button>
  )
}

function NotificationBell() {
  const [count, setCount] = useState(0)
  const [showList, setShowList] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    // TODO: subscribe แจ้งเตือนจาก Supabase (Realtime)
    // ตัวอย่าง mockup
    setNotifications([
      { id: 1, text: 'มีงานใหม่ที่ถูกมอบหมายให้คุณ', read: false },
      { id: 2, text: 'สถานะงาน #123 เปลี่ยนเป็น "กำลังดำเนินการ"', read: false },
    ])
    setCount(2)
  }, [])

  return (
    <div className="relative">
      <button onClick={() => setShowList(!showList)} className="relative px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-all shadow">
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse-slow">{count}</span>
        )}
      </button>
      {showList && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-50 border">
          <div className="p-4 font-bold border-b">แจ้งเตือน</div>
          <ul>
            {notifications.length === 0 && <li className="p-4 text-gray-400">ไม่มีแจ้งเตือน</li>}
            {notifications.map(n => (
              <li key={n.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer text-sm">
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') setDark(true)
  }, [])
  return (
    <button onClick={() => setDark(d => !d)} className="ml-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 transition-all">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}

export const metadata: Metadata = {
  title: 'ระบบแจ้งซ่อม KKRDC - AI-Powered',
  description: 'ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI สำหรับองค์กร KKRDC',
  keywords: ['repair', 'maintenance', 'ai', 'kkrdc', 'ระบบแจ้งซ่อม'],
  authors: [{ name: 'KKRDC Development Team' }],
  creator: 'KKRDC Development Team',
  publisher: 'KKRDC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://repair-system-final.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ระบบแจ้งซ่อม KKRDC - AI-Powered',
    description: 'ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI สำหรับองค์กร KKRDC',
    url: 'https://repair-system-final.vercel.app',
    siteName: 'KKRDC Repair System',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KKRDC Repair System',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ระบบแจ้งซ่อม KKRDC - AI-Powered',
    description: 'ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI สำหรับองค์กร KKRDC',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [lang, setLang] = useState('th')
  useEffect(() => {
    const l = localStorage.getItem('lang')
    if (l) setLang(l)
  }, [])
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <html lang={lang} className="scroll-smooth">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#3b82f6" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* DNS Prefetch */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        </head>
        <body className="antialiased">
          <div id="root">
            <div className="flex justify-end items-center p-4 gap-4">
              <LanguageToggle />
              <DarkModeToggle />
              <NotificationBell />
              <LogoutButton />
            </div>
            {children}
          </div>
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "ระบบแจ้งซ่อม KKRDC",
                "description": "ระบบจัดการแจ้งซ่อมขั้นสูงด้วย AI สำหรับองค์กร KKRDC",
                "url": "https://repair-system-final.vercel.app",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "THB"
                },
                "author": {
                  "@type": "Organization",
                  "name": "KKRDC",
                  "url": "https://kkrdc.com"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "KKRDC Development Team"
                }
              })
            }}
          />
        </body>
      </html>
    </LangContext.Provider>
  )
} 