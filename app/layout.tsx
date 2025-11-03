import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ModalProvider } from '@/contexts/ModalContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import LoadingManager from '@/components/LoadingManager'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marpro',
  description: 'Marpro - Containers, Excavators, Constructions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-dark-bg`}>
        <GoogleAnalytics gaId="G-7ZSNC2QFYH" />
        <LoadingProvider>
          <ClientThemeProvider>
            <LanguageProvider>
              <ModalProvider>
                <AuthProvider>
                  <LoadingManager>
                    {children}
                  </LoadingManager>
                </AuthProvider>
              </ModalProvider>
            </LanguageProvider>
          </ClientThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
