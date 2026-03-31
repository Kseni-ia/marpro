'use client'

import React, { useState } from 'react'
import Containers from '@/app/Container/ContainerPageClient'
import Excavators from '@/app/Excavator/ExcavatorPageClient'
import InstallationPageClient from '@/app/Installation/InstallationPageClient'
import AnimatedLogo from '@/components/AnimatedLogo'
import BlurUpBackground from '@/components/BlurUpBackground'
import Footer from '@/app/Footer'
import TopNavigation from '@/components/TopNavigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useModal } from '@/contexts/ModalContext'
import { getInstallationCopy } from '@/lib/installationCopy'
import { useRouter } from 'next/navigation'

type Section = 'home' | 'containers' | 'excavators' | 'installations'

export default function HomePageClient() {
  const [activeSection, setActiveSection] = useState<Section>('home')
  const { t, language } = useLanguage()
  const { isModalOpen } = useModal()
  const router = useRouter()
  const installationCopy = getInstallationCopy(language)

  const navigateToSection = (path: string) => {
    router.push(path)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'containers':
        return <Containers />
      case 'excavators':
        return <Excavators />
      case 'installations':
        return <InstallationPageClient />
      default:
        return (
          <div className="text-center ">
            <AnimatedLogo />
            <p className="text-base sm:text-lg md:text-xl text-gray-dark-textSecondary mb-4 mt-6 sm:mt-8">
              {t('nav.home')}
            </p>
            <div className="grid grid-cols-1 gap-6 justify-items-center max-w-full mx-auto px-2 md:hidden">
              <div
                id="containers"
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => navigateToSection('/Container')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {t('nav.containers')}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {t('containers.explore')}
                </p>
              </div>

              <div
                id="excavators"
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => navigateToSection('/Excavator')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {t('nav.excavators')}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {t('excavators.discover')}
                </p>
              </div>

              <div
                id="installations"
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => navigateToSection('/Installation')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {installationCopy.title}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {installationCopy.cardDescription}
                </p>
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10 justify-items-center max-w-[1800px] mx-auto">
              <div
                id="containers"
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => navigateToSection('/Container')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {t('nav.containers').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {t('containers.explore')}
                </p>
              </div>

              <div
                id="excavators"
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => navigateToSection('/Excavator')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {t('nav.excavators').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {t('excavators.discover')}
                </p>
              </div>

              <div
                id="installations"
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => navigateToSection('/Installation')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {installationCopy.title.toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {installationCopy.cardDescription}
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      <TopNavigation />

      {activeSection === 'home' && (
        <BlurUpBackground
          placeholderSrc="/loadC_Small.jpeg"
          fullSrc="/F4.mp4"
          overlayOpacity="bg-black/70"
        />
      )}

      <div className="relative min-h-screen z-10 flex flex-col">
        <main className="flex-1 flex justify-center items-center text-center pt-48 sm:pt-48 md:pt-48">
          {renderSection()}
        </main>

        {activeSection === 'home' && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}
      </div>
    </div>
  )
}
