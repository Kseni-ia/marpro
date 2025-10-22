'use client'

import React, { useState } from 'react'
import OrderForm from '@/components/OrderForm'
import ContainerCard from './components/ContainerCard'
import { useLanguage } from '@/contexts/LanguageContext'

const Containers: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const { t } = useLanguage()

  const handleOrder = () => {
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
          <source src="/containers_F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content readability */}
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
      </div>
      
      <div className="relative min-h-screen z-10">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
        {t('containers.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-dark-textSecondary text-center max-w-[760px] mx-auto mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-4">
        {t('containers.subtitle')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <ContainerCard
          volume={3}
          dims="2 x 0.5 x 3.8 m"
          description={t('containers.3m3.desc')}
          price={`${t('containers.price')} 3 090 CZK ${t('containers.vat')}`}
          onOrder={handleOrder}
        />
        <ContainerCard
          volume={5}
          dims="3 x 1.5 x 2 m"
          description={t('containers.5m3.desc')}
          price={`${t('containers.price')} 3 630 CZK ${t('containers.vat')}`}
          onOrder={handleOrder}
        />
        <ContainerCard
          volume={7}
          dims="3.5 x 1.5 x 2 m"
          description={t('containers.7m3.desc')}
          price={`${t('containers.price')} 4 330 CZK ${t('containers.vat')}`}
          onOrder={handleOrder}
        />
        <ContainerCard
          volume={9}
          dims="3.5 x 1.8 x 2.2 m"
          description={t('containers.9m3.desc')}
          price={`${t('containers.price')} 6 000 CZK ${t('containers.vat')}`}
          onOrder={handleOrder}
        />
      </div>
      
      {showOrderForm && (
        <OrderForm
          serviceType="containers"
          onClose={() => setShowOrderForm(false)}
        />
      )}
      </div>
      </div>
    </>
  )
}

export default Containers
