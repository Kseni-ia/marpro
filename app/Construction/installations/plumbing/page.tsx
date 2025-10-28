'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'

const Plumbing: React.FC = () => {
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

      <div className="relative min-h-screen z-10 flex flex-col items-center justify-center">
        <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in w-full max-w-3xl">
          
          {/* Back Button - Above Card */}
          <button
            onClick={() => router.back()}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-dark-textSecondary hover:text-gray-dark-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </button>

          {/* Coming Soon Card */}
          <div className="bg-gradient-maintenance-dark border-2 border-gray-dark-border rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 md:p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden rotating-bg">
            
            {/* Plumbing Icon */}
            <div className="flex items-center justify-center mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text mb-3 relative uppercase tracking-[1px] sm:tracking-[2px] font-bold shadow-text">
              {t('plumbing.title')}
            </h1>

            {/* Coming Soon Badge */}
            <div className="inline-block mb-4">
              <span className="bg-blue-500/20 text-blue-500 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider border border-blue-500/30">
                {t('plumbing.coming')}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-dark-textSecondary text-sm sm:text-base md:text-lg mb-2">
              {t('plumbing.desc')}
            </p>
            <p className="text-gray-dark-textSecondary text-sm sm:text-base">
              {t('plumbing.check')}
            </p>

            {/* Decorative Elements */}
            <div className="mt-6 flex justify-center gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Order Button */}
          <div className="text-center mt-10">
            <button 
              onClick={() => setShowOrderForm(true)}
              className="rounded-[14px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-base sm:text-lg hover:scale-105"
            >
              {t('installations.order')}
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

export default Plumbing
