'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useLanguage } from '@/contexts/LanguageContext'
import { Partner, readPartners } from '@/lib/partners'

const chipClass = 'inline-flex items-center gap-2 rounded-lg border border-gray-dark-border/30 bg-gray-dark-border/20 px-4 py-2 text-sm font-medium text-gray-dark-text'

export default function PartnerCompanies() {
  const { t } = useLanguage()
  const [partners, setPartners] = useState<Partner[]>([])
  useEffect(() => onSnapshot(doc(db, 'settings', 'partners'), (snapshot) => {
    setPartners(readPartners(snapshot.exists() ? snapshot.data() : undefined))
  }, () => { /* Keep the last known list during a connection failure. */ }), [])

  if (!partners.length) return null

  return <div className="mb-8 border-t border-gray-dark-border/30 pt-8 text-center md:text-left">
    <h3 className="text-red-500 text-lg font-bold uppercase tracking-wider mb-4">
      {t('footer.partners') || 'Spolupracujeme s'}
    </h3>
    <ul className="flex flex-wrap justify-center md:justify-start gap-3">
      {partners.map(({ name, url }, index) => <li key={`${index}-${name}`}>
        {url ? <a href={url} target="_blank" rel="noopener noreferrer"
          className={`${chipClass} hover:text-red-400 hover:bg-red-400/10 transition-all duration-300`}>
          {name}
          <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
        </a> : <span className={chipClass}>{name}</span>}
      </li>)}
    </ul>
  </div>
}
