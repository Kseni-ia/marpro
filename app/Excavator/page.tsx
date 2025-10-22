'use client'

import React, { useState } from 'react'
import OrderForm from '@/components/OrderForm'
import ExcavatorCard from './components/ExcavatorCard'
import { useLanguage } from '@/contexts/LanguageContext'

const Excavators: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const { t, language } = useLanguage()

  const handleOrder = () => {
    console.log('Order button clicked - opening form')
    setShowOrderForm(true)
  }

  return (
    <>
      {/* Full Screen Video Background - Outside all containers */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/exscavators F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content readability */}
        <div className="absolute inset-0 bg-black/80 z-10 pointer-events-none"></div>
      </div>
      
      <div className="relative min-h-screen z-20">
      
      {/* Content Container */}
      <div className="relative z-30 p-4 sm:p-6 md:p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
        {t('excavators.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-dark-textSecondary text-center max-w-[760px] mx-auto mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-4">
        {t('excavators.subtitle')}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <ExcavatorCard
          model="TB145"
          type={t('excavators.mini')}
          description={t('excavators.tb145.desc')}
          price={`${t('containers.price')} 2 500 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB145.svg"
          specs={{
            weight: "1.5t",
            bucketCapacity: "0.04m³",
            maxReach: "3.8m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB157"
          type={t('excavators.mini')}
          description={t('excavators.tb157.desc')}
          price={`${t('containers.price')} 2 800 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB157.svg"
          specs={{
            weight: "1.7t",
            bucketCapacity: "0.04m³",
            maxReach: "3.9m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB260"
          type={t('excavators.standard')}
          description={t('excavators.tb260.desc')}
          price={`${t('containers.price')} 3 500 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB260.svg"
          specs={{
            weight: "2.6t",
            bucketCapacity: "0.08m³",
            maxReach: "4.8m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB285"
          type={t('excavators.standard')}
          description={t('excavators.tb285.desc')}
          price={`${t('containers.price')} 3 800 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB285.svg.svg"
          specs={{
            weight: "2.8t",
            bucketCapacity: "0.09m³",
            maxReach: "5.2m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB2150"
          type={t('excavators.large')}
          description={t('excavators.tb2150.desc')}
          price={`${t('containers.price')} 4 500 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB290-2.svg.svg"
          specs={{
            weight: "2.9t",
            bucketCapacity: "0.11m³",
            maxReach: "5.5m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB2150R"
          type={t('excavators.large')}
          description={t('excavators.tb2150r.desc')}
          price={`${t('containers.price')} 5 000 CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
          svgPath="/TB290-2.svg.svg"
          specs={{
            weight: "3.5t",
            bucketCapacity: "0.14m³",
            maxReach: "6.2m"
          }}
          onOrder={handleOrder}
        />
      </div>
      
      {showOrderForm && (
        <OrderForm
          serviceType="excavators"
          onClose={() => setShowOrderForm(false)}
        />
      )}
      </div>
      </div>
    </>
  )
}

export default Excavators
