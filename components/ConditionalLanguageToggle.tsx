'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import LanguageToggle from './LanguageToggle'

const ConditionalLanguageToggle: React.FC = () => {
  const pathname = usePathname()
  
  // Hide the language toggle on admin pages since they have their own integrated toggle
  const isAdminPage = pathname?.startsWith('/admin')
  
  if (isAdminPage) {
    return null
  }
  
  return <LanguageToggle />
}

export default ConditionalLanguageToggle
