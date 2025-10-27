'use client'

import React, { useState, useEffect } from 'react'
import OrderForm from '@/components/OrderForm'
import ExcavatorCard from './components/ExcavatorCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { getActiveExcavators, Excavator } from '@/lib/excavators'

const Excavators: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const { t, language } = useLanguage()
  const [excavators, setExcavators] = useState<Excavator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExcavators = async () => {
      const data = await getActiveExcavators()
      setExcavators(data)
      setLoading(false)
    }
    fetchExcavators()
  }, [])

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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-dark-textSecondary">Loading excavators...</div>
        </div>
      ) : excavators.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-dark-textSecondary">No excavators available at the moment.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {excavators.map((excavator) => (
            <ExcavatorCard
              key={excavator.id}
              model={excavator.model}
              type={excavator.type}
              description={excavator.description[language]}
              price={`${t('containers.price')} ${excavator.price.toLocaleString('cs-CZ')} CZK/${t('excavators.price.day')} ${t('containers.vat')}`}
              svgPath={excavator.svgPath || '/TB145.svg'}
              specs={excavator.specs}
              onOrder={handleOrder}
            />
          ))}
        </div>
      )}
      
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
