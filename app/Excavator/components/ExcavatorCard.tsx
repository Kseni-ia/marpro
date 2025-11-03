'use client'

import React from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

type ExcavatorCardProps = {
  model: string
  type: string
  description: string
  price: string
  svgPath: string
  specs: {
    weight: string
    bucketCapacity: string
    maxReach: string
  }
  onOrder: () => void
}

const ExcavatorCard: React.FC<ExcavatorCardProps> = ({ model, type, description, price, svgPath, specs, onOrder }) => {
  const { t } = useLanguage()
  return (
    <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine z-20">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2 pointer-events-none"></div>
      <div className="flex items-start flex-col">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-dark-text">{model}</span>
          </div>
          <span className="text-gray-dark-textSecondary mt-1 block tracking-wide text-sm sm:text-base">{type}</span>
        </div>
      </div>
      <div className="my-4 sm:my-6 flex justify-center">
        <Image 
          src={svgPath} 
          alt={`${model} excavator`} 
          width={300} 
          height={200} 
          className="w-full h-[120px] sm:h-[160px] md:h-[200px] object-contain"
        />
      </div>
      <div className="h-px w-full bg-gray-e8e dark:bg-gray-dark-border my-4"></div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Bucket</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.bucketCapacity}</div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Max Reach</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.maxReach}</div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Weight</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.weight}</div>
        </div>
      </div>
      <p className="text-gray-dark-textSecondary leading-relaxed text-sm sm:text-base">{description}</p>
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-gray-dark-border bg-gray-dark-card text-gray-dark-text font-medium shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-sm sm:text-base">
          {price}
        </div>
      </div>
      <div className="mt-4 sm:mt-5 flex items-center justify-center relative z-10">
        <button 
          onClick={onOrder}
          className="rounded-[14px] px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base cursor-pointer"
        >
          {t('excavators.order')}
        </button>
      </div>
    </div>
  )
}

export default ExcavatorCard
