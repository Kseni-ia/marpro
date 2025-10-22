'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'

const Demolishing: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const demolitionTypes = [
    {
      icon: '🏢',
      title: t('demolishing.complete'),
      description: t('demolishing.complete.desc'),
    },
    {
      icon: '🔨',
      title: t('demolishing.partial'),
      description: t('demolishing.partial.desc'),
    },
    {
      icon: '🏠',
      title: t('demolishing.interior'),
      description: t('demolishing.interior.desc'),
    },
    {
      icon: '🧱',
      title: t('demolishing.concrete'),
      description: t('demolishing.concrete.desc'),
    },
    {
      icon: '🏭',
      title: t('demolishing.industrial'),
      description: t('demolishing.industrial.desc'),
    },
    {
      icon: '🚨',
      title: t('demolishing.emergency'),
      description: t('demolishing.emergency.desc'),
    },
  ]

  const features = [
    {
      icon: '🛡️',
      title: t('demolishing.safety'),
      description: t('demolishing.safety.desc'),
    },
    {
      icon: '♻️',
      title: t('demolishing.eco'),
      description: t('demolishing.eco.desc'),
    },
    {
      icon: '⚙️',
      title: t('demolishing.equipment'),
      description: t('demolishing.equipment.desc'),
    },
  ]

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
        <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-screen pt-24 sm:pt-20 md:pt-28">
          
          {/* Back Button */}
          <button
            onClick={() => router.push('/Construction')}
            className="mb-6 flex items-center gap-2 text-gray-dark-textSecondary hover:text-gray-dark-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </button>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-4 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
            {t('demolishing.title')}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse-width"></span>
          </h1>

          <p className="text-gray-dark-textSecondary text-center text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            {t('demolishing.subtitle')}
          </p>

          {/* Types of Demolition */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-8 font-bold uppercase">
              {t('demolishing.types')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {demolitionTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-5 sm:p-6 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-red-500/30 card-shine"
                >
                  <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-gray-dark-text text-lg sm:text-xl md:text-2xl mb-3 font-bold">
                      {type.title}
                    </h3>
                    <p className="text-gray-dark-textSecondary text-sm sm:text-base">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-8 font-bold uppercase">
              {t('demolishing.features')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-maintenance-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-6 sm:p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden rotating-bg"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-gray-dark-text text-xl sm:text-2xl mb-3 font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-dark-textSecondary text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Button */}
          <div className="text-center mt-10">
            <button 
              onClick={() => setShowOrderForm(true)}
              className="rounded-[14px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-base sm:text-lg hover:scale-105"
            >
              {t('demolishing.order')}
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

export default Demolishing
