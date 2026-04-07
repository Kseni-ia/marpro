import type { Metadata } from 'next'
import CenikPageClient from './CenikPageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Ceník služeb',
  description:
    'Přehled služeb MARPRO s.r.o. a orientačních cen včetně popisu jednotlivých realizací.',
  path: '/Cenik',
})

export default function CenikPage() {
  return <CenikPageClient />
}
