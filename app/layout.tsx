import type { Metadata } from 'next'
import './globals.css'

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
  return (
    <html lang="th" className="scroll-smooth">
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
  )
} 