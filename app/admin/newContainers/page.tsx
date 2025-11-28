'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import NavigationBar from '@/app/admin/NavigationBar'
import ContainersList from './components/ContainersList'
import WasteTypesList from '@/app/admin/pricing/components/WasteTypesList'
import SurchargesList from '@/app/admin/pricing/components/SurchargesList'

export default function AddRemoveContainer() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16 sm:pt-12 md:pt-16 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-dark-text uppercase tracking-wider mb-2">
              {t('admin.containerManagement')}
            </h1>
            <p className="text-gray-dark-textSecondary text-sm sm:text-base">
              {t('admin.containerManagementDesc')}
            </p>
          </div>

          {/* Containers List */}
          <ContainersList />

          {/* Divider */}
          <div className="my-12 border-t border-gray-700/50" />

          {/* Waste Types / Pricing Section */}
          <div className="mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-dark-text uppercase tracking-wider mb-2">
              Ceník dle typu odpadu
            </h2>
            <p className="text-gray-dark-textSecondary text-sm sm:text-base">
              Nastavte ceny kontejnerů podle typu odpadu
            </p>
          </div>

          {/* Waste Types List */}
          <WasteTypesList />

          {/* Divider */}
          <div className="my-12 border-t border-gray-700/50" />

          {/* Surcharges Section */}
          <div className="mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-dark-text uppercase tracking-wider mb-2">
              Příplatky
            </h2>
            <p className="text-gray-dark-textSecondary text-sm sm:text-base">
              Nastavte příplatky za dopravu, víkendy a další služby
            </p>
          </div>

          {/* Surcharges List */}
          <SurchargesList serviceType="containers" />
        </div>
      </div>
    </div>
  )
}
