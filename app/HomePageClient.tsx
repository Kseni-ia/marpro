'use client'

import React, { useState } from 'react'
import Containers from '@/app/Container/ContainerPageClient'
import Excavators from '@/app/Excavator/ExcavatorPageClient'
import InstallationPageClient from '@/app/Installation/InstallationPageClient'
import AnimatedLogo from '@/components/AnimatedLogo'
import BlurUpBackground from '@/components/BlurUpBackground'
import Footer from '@/app/Footer'
import TopNavigation from '@/components/TopNavigation'
import ReferencesTeaser from '@/components/ReferencesTeaser'
import { useLanguage } from '@/contexts/LanguageContext'
import { useModal } from '@/contexts/ModalContext'
import { getInstallationCopy } from '@/lib/installationCopy'
import { Reference } from '@/lib/constructions'
import { useRouter } from 'next/navigation'
import { Truck, Hammer, Wrench } from 'lucide-react'

type Section = 'home' | 'containers' | 'excavators' | 'installations'

type HomePageClientProps = {
  references?: Reference[]
}

export default function HomePageClient({ references = [] }: HomePageClientProps) {
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [hoveredSection, setHoveredSection] = useState<Section>('home')
  const { t, language } = useLanguage()
  const { isModalOpen } = useModal()
  const router = useRouter()
  const installationCopy = getInstallationCopy(language)

  const getBackgroundConfig = () => {
    switch (hoveredSection) {
      case 'containers':
        return {
          placeholderSrc: '/containers_small.jpeg',
          fullSrc: '/containers_bg.jpeg',
          isVideo: false,
        }
      case 'excavators':
        return {
          placeholderSrc: '/excavators_small.jpeg',
          fullSrc: '/excavators_bg.jpeg',
          isVideo: false,
        }
      case 'installations':
        return {
          placeholderSrc: '/plumbing_small.jpeg',
          fullSrc: '/plumbing_bg.jpeg',
          isVideo: false,
        }
      default:
        return {
          placeholderSrc: '/home_default_small.jpeg',
          fullSrc: '/home_default_bg.jpeg',
          isVideo: false,
        }
    }
  }

  const bgConfig = getBackgroundConfig()

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
            {/* Crawlable brand heading — visually hidden, read by Google & screen readers */}
            <h1 className="sr-only">
              TZB MARPRO — Kontejnery, bagry a stavební práce v Praze
            </h1>
            <p className="sr-only">
              TZB MARPRO (MARPRO s.r.o.) je stavební firma v Praze. Nabízíme
              pronájem kontejnerů, práce bagrem, stavební práce a instalatérské
              a topenářské služby v Praze a okolí.
            </p>
            <AnimatedLogo />
            <p className="text-base sm:text-lg md:text-xl text-gray-dark-textSecondary mb-4 mt-6 sm:mt-8">
              {t('nav.home')}
            </p>
            <div className="grid grid-cols-1 gap-5 justify-items-center max-w-[340px] w-full mx-auto px-4 md:hidden">
              <div
                id="containers"
                className="w-full relative overflow-hidden group p-4 rounded-[20px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] card-shine flex items-center space-x-4"
                onClick={() => navigateToSection('/Container')}
                onMouseEnter={() => setHoveredSection('containers')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Truck className="w-5.5 h-5.5 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-left">
                  <h3 className="text-gray-dark-text text-lg font-bold uppercase tracking-[1px] mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {t('nav.containers')}
                  </h3>
                  <p className="text-gray-dark-textSecondary text-xs leading-normal group-hover:text-gray-200 transition-colors duration-300">
                    {t('containers.explore')}
                  </p>
                </div>
              </div>

              <div
                id="excavators"
                className="w-full relative overflow-hidden group p-4 rounded-[20px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] card-shine flex items-center space-x-4"
                onClick={() => navigateToSection('/Excavator')}
                onMouseEnter={() => setHoveredSection('excavators')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Hammer className="w-5.5 h-5.5 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-left">
                  <h3 className="text-gray-dark-text text-lg font-bold uppercase tracking-[1px] mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {t('nav.excavators')}
                  </h3>
                  <p className="text-gray-dark-textSecondary text-xs leading-normal group-hover:text-gray-200 transition-colors duration-300">
                    {t('excavators.discover')}
                  </p>
                </div>
              </div>

              <div
                id="installations"
                className="w-full relative overflow-hidden group p-4 rounded-[20px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] card-shine flex items-center space-x-4"
                onClick={() => navigateToSection('/Installation')}
                onMouseEnter={() => setHoveredSection('installations')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 flex-shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Wrench className="w-5.5 h-5.5 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-left">
                  <h3 className="text-gray-dark-text text-lg font-bold uppercase tracking-[1px] mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {installationCopy.title}
                  </h3>
                  <p className="text-gray-dark-textSecondary text-xs leading-normal group-hover:text-gray-200 transition-colors duration-300">
                    {installationCopy.cardDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10 justify-items-center max-w-[1800px] mx-auto">
              <div
                id="containers"
                className="relative overflow-hidden group w-[320px] h-[190px] flex flex-col justify-center items-center px-6 py-5 rounded-[24px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-2 hover:scale-[1.03] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] card-shine text-center"
                onClick={() => navigateToSection('/Container')}
                onMouseEnter={() => setHoveredSection('containers')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 mb-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Truck className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-gray-dark-text text-xl font-bold uppercase tracking-[2px] mb-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
                  {t('nav.containers').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-normal max-w-[260px] group-hover:text-gray-200 transition-colors duration-300">
                  {t('containers.explore')}
                </p>
              </div>

              <div
                id="excavators"
                className="relative overflow-hidden group w-[320px] h-[190px] flex flex-col justify-center items-center px-6 py-5 rounded-[24px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-2 hover:scale-[1.03] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] card-shine text-center"
                onClick={() => navigateToSection('/Excavator')}
                onMouseEnter={() => setHoveredSection('excavators')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 mb-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Hammer className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-gray-dark-text text-xl font-bold uppercase tracking-[2px] mb-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
                  {t('nav.excavators').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-normal max-w-[260px] group-hover:text-gray-200 transition-colors duration-300">
                  {t('excavators.discover')}
                </p>
              </div>

              <div
                id="installations"
                className="relative overflow-hidden group w-[320px] h-[190px] flex flex-col justify-center items-center px-6 py-5 rounded-[24px] cursor-pointer transition-all duration-300 backdrop-blur-md bg-gray-dark-card/60 border border-gray-dark-border/60 hover:border-red-500/40 hover:bg-gray-dark-card/85 hover:-translate-y-2 hover:scale-[1.03] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] card-shine text-center"
                onClick={() => navigateToSection('/Installation')}
                onMouseEnter={() => setHoveredSection('installations')}
                onMouseLeave={() => setHoveredSection('home')}
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-300 transition-all duration-300 mb-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Wrench className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-gray-dark-text text-xl font-bold uppercase tracking-[2px] mb-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
                  {installationCopy.title.toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-normal max-w-[260px] group-hover:text-gray-200 transition-colors duration-300">
                  {installationCopy.cardDescription}
                </p>
              </div>
            </div>

            <ReferencesTeaser references={references} />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      <TopNavigation />

      {activeSection === 'home' && (
        <BlurUpBackground
          placeholderSrc={bgConfig.placeholderSrc}
          fullSrc={bgConfig.fullSrc}
          overlayOpacity="bg-black/70"
          isVideo={bgConfig.isVideo}
        />
      )}

      {/* Preload background assets for seamless hover transitions */}
      <div className="hidden">
        <img src="/containers_bg.jpeg" alt="" />
        <img src="/excavators_bg.jpeg" alt="" />
        <img src="/plumbing_bg.jpeg" alt="" />
      </div>

      <div className="relative min-h-screen z-10 flex flex-col">
        <main className="flex-1 flex justify-center items-center text-center pt-20 sm:pt-28 md:pt-48">
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
