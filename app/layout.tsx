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
        <div id="error-boundary-debug" style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'red', color: 'white', zIndex: 99999, padding: '10px', display: 'none', maxHeight: '50vh', overflow: 'auto', fontSize: '12px' }}></div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('error', function(event) {
            var el = document.getElementById('error-boundary-debug');
            if (el) {
              el.style.display = 'block';
              el.innerHTML += '<p><strong>Error:</strong> ' + event.message + '</p>';
            }
          });
          window.addEventListener('unhandledrejection', function(event) {
            var el = document.getElementById('error-boundary-debug');
            if (el) {
              el.style.display = 'block';
              el.innerHTML += '<p><strong>Rejection:</strong> ' + (event.reason ? event.reason.message || event.reason : 'unknown') + '</p>';
            }
          });
        ` }} />
        {children}
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
