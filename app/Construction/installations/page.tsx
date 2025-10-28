'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'

const Installations: React.FC = () => {
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

      <div className="relative min-h-screen z-10">
        <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-screen">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-dark-textSecondary hover:text-gray-dark-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </button>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-4 sm:mb-6 pb-3 sm:pb-4 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
            {t('installations.title')}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse-width"></span>
          </h1>

          <p className="text-gray-dark-textSecondary text-center text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
            {t('installations.subtitle')}
          </p>

          {/* Installation Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-10">
            
            {/* Plumbing & Heating Card */}
            <div 
              className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] sm:rounded-[25px] p-6 sm:p-8 md:p-10 transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark cursor-pointer card-shine"
              onClick={() => router.push('/Construction/installations/plumbing')}
            >
              <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-3 font-bold uppercase tracking-wide">
                  {t('constructions.plumbing')}
                </h2>
                <p className="text-gray-dark-textSecondary text-center text-sm sm:text-base md:text-lg">
                  {t('constructions.plumbing.desc')}
                </p>
                <div className="mt-6 text-center">
                  <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider group-hover:underline">
                    {t('common.more')} →
                  </span>
                </div>
              </div>
            </div>

            {/* Placeholder for future installation services */}
            <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] sm:rounded-[25px] p-6 sm:p-8 md:p-10 transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden opacity-50">
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-3 font-bold uppercase tracking-wide">
                  More Services
                </h2>
                <p className="text-gray-dark-textSecondary text-center text-sm sm:text-base md:text-lg">
                  Additional installation services coming soon
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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

export default Installations
