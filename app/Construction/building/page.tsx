'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'

const Building: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <>
      {/* Full Screen Video Background */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="/constructions F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-0 left-0 sm:-top-14 sm:-left-12 z-30">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={250}
          height={200}
          className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[250px] w-auto cursor-pointer transition-all duration-300"
          onClick={() => router.push('/')}
        />
      </div>

      <div className="relative min-h-screen z-10 flex items-center justify-center">
        <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in w-full max-w-4xl">
          
          {/* Back Button */}
          <button
            onClick={() => router.push('/Construction')}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-dark-textSecondary hover:text-gray-dark-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </button>

          {/* Coming Soon Card */}
          <div className="bg-gradient-maintenance-dark border-2 border-gray-dark-border rounded-[20px] sm:rounded-[25px] p-8 sm:p-12 md:p-16 text-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] relative overflow-hidden rotating-bg">
            
            {/* Building Icon */}
            <div className="flex items-center justify-center mb-6">
              <svg className="w-24 h-24 sm:w-32 sm:h-32 text-green-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text mb-4 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
              {t('building.title')}
            </h1>

            {/* Coming Soon Badge */}
            <div className="inline-block mb-6">
              <span className="bg-green-500/20 text-green-500 px-6 py-2 rounded-full text-sm sm:text-base font-semibold uppercase tracking-wider border border-green-500/30">
                {t('building.coming')}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-dark-textSecondary text-base sm:text-lg md:text-xl mb-4">
              {t('building.desc')}
            </p>
            <p className="text-gray-dark-textSecondary text-base sm:text-lg">
              {t('building.check')}
            </p>

            {/* Decorative Elements */}
            <div className="mt-10 flex justify-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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

          {showOrderForm && (
            <OrderForm
              serviceType="constructions"
              onClose={() => setShowOrderForm(false)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Building
