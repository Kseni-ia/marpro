'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import NavigationBar from '@/app/admin/NavigationBar'
import SocialLinksForm from './SocialLinksForm'
import EquipmentSchedule from '@/components/EquipmentSchedule'

export default function SettingsPage() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [showSchedule, setShowSchedule] = useState(false)

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-main-dark">
        <div className="text-xl text-gray-dark-text">{t('admin.loading')}</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-main-dark">
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <Image
          src="/logoDF.svg"
          alt="MARPRO"
          width={60}
          height={60}
          className="h-6 w-auto object-contain transition-all duration-300 sm:h-7 md:h-8"
          style={{ objectPosition: 'left top' }}
        />
      </div>

      <NavigationBar onScheduleClick={() => setShowSchedule(true)} onLogout={handleLogout} />

      {showSchedule && <EquipmentSchedule onClose={() => setShowSchedule(false)} />}

      <div className="relative md:ml-16">
        <div className="mx-auto max-w-6xl px-4 py-5 pb-20 pt-16 sm:px-6 sm:pt-12 md:pt-16 md:pb-8 lg:px-8">
          <div className="mb-6 rounded-[26px] border border-white/8 bg-white/[0.025] px-5 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/80">
              Admin
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-gray-dark-text sm:text-2xl">
              Nastavení webu
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-dark-textSecondary">
              Spravujte odkazy na sociální sítě zobrazené na webu.
            </p>
          </div>

          <SocialLinksForm />
        </div>
      </div>
    </div>
  )
}
