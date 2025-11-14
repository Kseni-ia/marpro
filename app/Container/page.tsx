'use client'

import React, { useState, useEffect } from 'react'
import OrderForm from '@/components/OrderForm'
import BlurUpBackground from '@/components/BlurUpBackground'
import ContainerCard from './components/ContainerCard'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { getActiveContainers, Container } from '@/lib/containers'

const Containers: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const { t, language } = useLanguage()
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContainers = async () => {
      const data = await getActiveContainers()
      setContainers(data)
      setLoading(false)
    }
    fetchContainers()
  }, [])

  const handleOrder = () => {
    setShowOrderForm(true)
  }

  return (
    <>
      <TopNavigation />
      
      {/* Full Screen Blur-Up Background */}
      <BlurUpBackground
        placeholderSrc="/loadK_Small.jpeg"
        fullSrc="/containers_F.mp4"
        overlayOpacity="bg-black/70"
        isVideo={true}
      />
      
      <div className="relative min-h-screen z-10 pt-16">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
        {t('containers.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-dark-textSecondary text-center max-w-[760px] mx-auto mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-4">
        {t('containers.subtitle')}
      </p>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-dark-textSecondary">{t('containers.loading')}</div>
        </div>
      ) : containers.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-dark-textSecondary">{t('containers.noAvailable')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {containers.map((container) => (
            <ContainerCard
              key={container.id}
              volume={container.volume}
              dims={container.dims}
              description={container.description}
              price={`${t('containers.price')} ${container.price.toLocaleString('cs-CZ')} CZK/hour ${t('containers.vat')}`}
              onOrder={handleOrder}
            />
          ))}
        </div>
      )}
      
      {showOrderForm && (
        <OrderForm
          serviceType="containers"
          onClose={() => setShowOrderForm(false)}
        />
      )}
      </div>
      <Footer />
      </div>
    </>
  )
}

export default Containers
