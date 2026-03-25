import type { Metadata } from 'next'
import ContainerPageClient from './ContainerPageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Pristaveni kontejneru',
  description:
    'Objednejte pristaveni kontejneru pro odvoz odpadu a materialu v Praze a okoli s rychlym zpracovanim objednavek od MARPRO s.r.o.',
  path: '/Container',
})

export default function ContainerPage() {
  return <ContainerPageClient />
}
