import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Kontejnery, bagry a stavebni prace v Praze',
  description:
    'MARPRO s.r.o. zajistuje pristaveni kontejneru, pronajem bagru a stavebni a instalacni prace v Praze a okoli.',
  path: '/',
})

export default function Home() {
  return <HomePageClient />
}
