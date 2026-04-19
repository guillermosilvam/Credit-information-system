import type { Metadata, Viewport } from 'next'
import { Poppins, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: {
    default: 'Agrofinanciamiento - Credito Agricola',
    template: '%s | Agrofinanciamiento'
  },
  description: 'Queremos fomentar la produccion agricola del pais para apoyar el crecimiento en el sector, facilitando el acceso a creditos.',
  keywords: ['financiamiento', 'agricola', 'credito', 'productores', 'venezuela', 'agro'],
}

export const viewport: Viewport = {
  themeColor: '#2d7a3a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${poppins.variable} ${sourceSans.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
