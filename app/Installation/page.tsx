import type { Metadata } from 'next'
import InstallationPageClient from './InstallationPageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Instalatérské služby a reference realizací',
  description:
    'MARPRO s.r.o. dodává instalatérské služby, rekonstrukce a reference realizací pro bytové, komerční i průmyslové projekty.',
  path: '/Installation',
})

export default function InstallationPage() {
  return <InstallationPageClient />
}
