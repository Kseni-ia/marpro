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
import {
  defaultMetadata,
  organizationStructuredData,
  websiteStructuredData,
} from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} bg-gray-dark-bg`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
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
