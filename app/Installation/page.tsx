import type { Metadata } from 'next'
import InstallationPageClient from './InstallationPageClient'
import { getPublicActiveReferences } from '@/lib/constructionsPublic'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Instalatérské služby a reference realizací',
  description:
    'MARPRO s.r.o. dodává instalatérské služby, rekonstrukce a reference realizací pro bytové, komerční i průmyslové projekty.',
  path: '/Installation',
})

export default async function InstallationPage() {
  const initialReferences = await getPublicActiveReferences()

  return <InstallationPageClient initialReferences={initialReferences} />
}
