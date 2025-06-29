import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '../components/Footer'
import { LiveFeedProvider } from '../contexts/LiveFeedContext'
import { SOSProvider } from '../contexts/SOSContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UG - The Underground Campus Hub',
  description: 'A modern, engaging campus social platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SOSProvider>
          <LiveFeedProvider>
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </LiveFeedProvider>
        </SOSProvider>
      </body>
    </html>
  )
}
