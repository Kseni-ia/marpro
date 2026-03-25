import type { Metadata } from 'next'
import ConstructionPageClient from './ConstructionPageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Stavebni a instalacni prace',
  description:
    'MARPRO s.r.o. dodava stavebni a instalacni prace, rekonstrukce a reference realizaci pro bytove, komercni i prumyslove projekty.',
  path: '/Construction',
})

export default function ConstructionPage() {
  return <ConstructionPageClient />
}
