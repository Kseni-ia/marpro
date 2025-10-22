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
      <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-dark-text">{model}</span>
          </div>
          <span className="text-gray-dark-textSecondary mt-1 block tracking-wide text-sm sm:text-base">{type}</span>
        </div>
        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-dark-card/80 border border-gray-dark-border text-xs sm:text-sm text-gray-dark-textSecondary shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <span className="relative inline-block w-8 sm:w-10 h-4 sm:h-5 rounded-full bg-gray-dark-border">
              <span className="absolute top-0.5 left-0.5 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-dark-card border border-gray-dark-border shadow-sm"></span>
            </span>
            <span className="whitespace-nowrap">Available</span>
          </div>
          <div className="text-gray-dark-textSecondary text-xs sm:text-sm mt-2">{specs.weight}</div>
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
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
        <button 
          onClick={onOrder}
          className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base cursor-pointer"
        >
          {t('excavators.order')}
        </button>
        <button className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-dark-card border-2 border-gray-dark-border text-gray-dark-textSecondary hover:border-gray-dark-border transition-all text-sm sm:text-base cursor-pointer">
          Details
        </button>
      </div>
    </div>
  )
}

export default ExcavatorCard
