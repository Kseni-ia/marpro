'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import NavigationBar from '@/app/admin/NavigationBar'
import ConstructionsList from './components/ConstructionsList'

export default function AddRemoveConstruction() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, authLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/admin')
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-main-dark flex items-center justify-center">
        <div className="text-gray-dark-text text-xl">{t('admin.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <Image 
          src="/logoDF.svg" 
          alt="MARPRO" 
          width={60}
          height={60}
          className="h-6 w-auto transition-all duration-300 object-contain sm:h-7 md:h-8"
          style={{ objectPosition: 'left top' }}
        />
      </div>
      
      {/* Left Navigation Bar */}
      <NavigationBar 
        onScheduleClick={() => {}}
        onLogout={handleLogout}
      />
      
      {/* Main Content Area */}
      <div className="relative md:ml-16">
        <div className="mx-auto max-w-6xl px-4 py-5 pb-20 pt-16 sm:px-6 sm:pt-12 md:pt-16 lg:px-8 md:pb-8">
          <div className="mb-6 rounded-[26px] border border-white/8 bg-white/[0.025] px-5 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/80">
              Admin
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-gray-dark-text sm:text-2xl">
              Správa staveb
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-dark-textSecondary">
              Správa demoličních a instalačních služeb a referencí
            </p>
          </div>

          <ConstructionsList />
        </div>
      </div>
    </div>
  )
}
