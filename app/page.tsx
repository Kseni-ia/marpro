import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { getPublicActiveReferences } from '@/lib/constructionsPublic'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Kontejnery, bagry a stavební práce v Praze',
    description:
      'TZB MARPRO (MARPRO s.r.o.) zajišťuje přistavení kontejnerů, pronájem bagrů a stavební a instalační práce v Praze a okolí.',
    path: '/',
  }),
  // Absolute title so the homepage tab/search result leads with the brand name
  title: { absolute: 'TZB MARPRO | Kontejnery, bagry a stavební práce v Praze' },
}

export default async function Home() {
  const references = await getPublicActiveReferences()

  return <HomePageClient references={references} />
}
