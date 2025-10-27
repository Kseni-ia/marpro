'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Containers from '@/app/Container/page'
import Excavators from '@/app/Excavator/page'
import Constructions from '@/app/Construction/page'
import AnimatedLogo from '@/components/AnimatedLogo'
import Footer from '@/app/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { useModal } from '@/contexts/ModalContext'

type Section = 'home' | 'containers' | 'excavators' | 'constructions'

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home')
  const { t } = useLanguage()
  const { isModalOpen } = useModal()

  const renderSection = () => {
    switch (activeSection) {
      case 'containers':
        return <Containers />
      case 'excavators':
        return <Excavators />
      case 'constructions':
        return <Constructions />
      default:
        return (
          
          <div className="text-center ">
            <AnimatedLogo />
            <p className="text-base sm:text-lg md:text-xl text-gray-dark-textSecondary mb-4 mt-6 sm:mt-8">{t('nav.home')}</p>
            {/* Mobile and tablet view - 1 column (all three sections) */}
            <div className="grid grid-cols-1 gap-6 justify-items-center max-w-full mx-auto px-2 md:hidden">
              <div 
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {t('nav.containers')}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {t('containers.explore')}
                </p>
              </div>
              
              <div 
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {t('nav.excavators')}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {t('excavators.discover')}
                </p>
              </div>
              
              <div 
                className="w-full max-w-xs bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] p-5 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-gray-dark-text text-xl mb-3 font-bold uppercase tracking-[1px]">
                  {t('nav.constructions')}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm">
                  {t('constructions.view')}
                </p>
              </div>
            </div>

            {/* Desktop view - 3 columns with constructions */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10 justify-items-center max-w-7xl mx-auto">
              <div 
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {t('nav.containers').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {t('containers.explore')}
                </p>
              </div>
              
              <div 
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {t('nav.excavators').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {t('excavators.discover')}
                </p>
              </div>
              
              <div 
                className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.6)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border text-center w-[320px] h-[160px] flex flex-col justify-center items-center px-6 py-6"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-gray-dark-text text-2xl font-bold uppercase tracking-[2px] mb-3 leading-tight">
                  {t('nav.constructions').toUpperCase()}
                </h3>
                <p className="text-gray-dark-textSecondary text-sm leading-tight">
                  {t('constructions.view')}
                </p>
              </div>
            </div>
          </div>
          
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container - Independent positioning - hidden when modal is open */}
      {!isModalOpen && (
        <div className="absolute top-0 left-0 sm:-top-14 sm:-left-12 z-30">
          <Image 
            src="/logo.svg" 
            alt="MARPRO" 
            width={250}
            height={200}
            className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[250px] w-auto cursor-pointer transition-all duration-300"
            onClick={() => setActiveSection('home')}
          />
        </div>
      )}
      
      {activeSection === 'home' && (
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/F4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
        </div>
      )}

      {/* Background */}
      <div className="relative min-h-screen z-10 flex flex-col">
        {/* Logo bg */}
        <div className="relative px-4 sm:px-5 pt-24 sm:pt-20 md:pt-28 pb-4 sm:pb-3">
          {/* section buttons (inline) - only show when NOT on home page and modal is closed */}
          {!isModalOpen && activeSection !== 'home' && (
            <div className="flex justify-center items-center md:w-full">
              <nav className="flex justify-center items-center gap-1 bg-gray-dark-card/90 backdrop-blur-[10px] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] p-1.5 sm:p-1.5 md:p-2 shadow-[0_2px_15px_rgba(0,0,0,0.3)] z-20 w-full max-w-sm sm:max-w-none sm:w-auto">
                <button 
                  className={`bg-transparent text-gray-dark-textSecondary border-none px-4 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text flex-1 sm:flex-none ${
                    activeSection === 'containers' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
                  }`}
                  onClick={() => setActiveSection('containers')}
                >
                  {t('nav.containers')}
                </button>
                <button 
                  className={`bg-transparent text-gray-dark-textSecondary border-none px-6 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text flex-1 sm:flex-none ${
                    activeSection === 'excavators' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
                  }`}
                  onClick={() => setActiveSection('excavators')}
                >
                  {t('nav.excavators')}
                </button>
                <button 
                  className={`bg-transparent text-gray-dark-textSecondary border-none px-6 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text flex-1 sm:flex-none ${
                    activeSection === 'constructions' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
                  }`}
                  onClick={() => setActiveSection('constructions')}
                >
                  {t('nav.constructions')}
                </button>
              </nav>
            </div>
          )}
        </div>
        <main className="flex-1 flex justify-center items-center text-center">
          {renderSection()}
        </main>
        
        {/* Footer - only show on home section, fixed at bottom */}
        {activeSection === 'home' && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}
      </div>
    </div>
  )
}
