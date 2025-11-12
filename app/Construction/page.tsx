'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'
import WorkWithUs from './work/WorkWithUs'

const Constructions: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const [showOrderForm, setShowOrderForm] = useState(false)

  return (
    <>
      <TopNavigation />
      
      {/* Full Screen Blur-Up Background */}
      <BlurUpBackground
        placeholderSrc="/loadC Small.jpeg"
        fullSrc="/constructions F.mp4"
        overlayOpacity="bg-black/70"
        isVideo={true}
      />
      
      <div className="relative min-h-screen z-10 pt-16">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-8 sm:mb-10 md:mb-12 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
          {t('constructions.title')}
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
        </h1>
      
      {/* Two Main Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
        {/* Demolishing Card */}
        <div 
          className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] sm:rounded-[25px] p-6 sm:p-8 md:p-10 transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark cursor-pointer card-shine"
          onClick={() => router.push('/Construction/demolishing')}
        >
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-3 font-bold uppercase tracking-wide">
              {t('constructions.demolishing')}
            </h2>
            <p className="text-gray-dark-textSecondary text-center text-sm sm:text-base md:text-lg">
              {t('constructions.demolishing.desc')}
            </p>
            <div className="mt-6 text-center">
              <span className="text-red-500 font-semibold text-sm uppercase tracking-wider group-hover:underline">
                {t('common.more')} →
              </span>
            </div>
          </div>
        </div>

        {/* Installations Card */}
        <div 
          className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] sm:rounded-[25px] p-6 sm:p-8 md:p-10 transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark cursor-pointer card-shine"
          onClick={() => router.push('/Construction/installations')}
        >
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-3 font-bold uppercase tracking-wide">
              {t('constructions.installations')}
            </h2>
            <p className="text-gray-dark-textSecondary text-center text-sm sm:text-base md:text-lg">
              {t('constructions.installations.desc')}
            </p>
            <div className="mt-6 text-center">
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider group-hover:underline">
                {t('common.more')} →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Button */}
      <div className="text-center mt-10">
        <button 
          onClick={() => setShowOrderForm(true)}
          className="rounded-[14px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-base sm:text-lg hover:scale-105"
        >
          {t('constructions.order')}
        </button>
      </div>

      {/* Work With Us Button */}
      <WorkWithUs />
        
        {showOrderForm && (
          <OrderForm
            serviceType="constructions"
            onClose={() => setShowOrderForm(false)}
          />
        )}
      </div>
      <Footer />
      </div>
    </>
  )
}

export default Constructions
