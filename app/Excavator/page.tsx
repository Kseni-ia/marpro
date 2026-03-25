import type { Metadata } from 'next'
import ExcavatorPageClient from './ExcavatorPageClient'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Pronajem bagru a minibagru',
  description:
    'Pronajmete si bagry a minibagry od MARPRO s.r.o. pro zemni prace, vykopy a stavebni realizace v Praze a okoli.',
  path: '/Excavator',
})

export default function ExcavatorPage() {
  return <ExcavatorPageClient />
}
