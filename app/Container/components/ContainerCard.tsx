'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type ContainerCardProps = {
  volume: number
  dims: string
  description: string
  price: string
  onOrder: () => void
}

const ContainerCard: React.FC<ContainerCardProps> = ({ volume, dims, description, price, onOrder }) => {
  const { t } = useLanguage()
  return (
    <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2 pointer-events-none"></div>
      <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0 relative z-10">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-dark-text">{volume}</span>
            <span className="text-xl sm:text-2xl md:text-3xl text-gray-dark-textSecondary">m</span>
            <sup className="text-base sm:text-lg md:text-xl -translate-y-1 inline-block text-gray-dark-textSecondary">3</sup>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-gray-dark-textSecondary text-xs sm:text-sm mt-2">{dims}</div>
        </div>
      </div>
      <div className="my-4 sm:my-6 relative z-10">
        <svg viewBox="0 0 360 120" className="w-full h-[80px] sm:h-[100px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Container truck illustration">
          <rect x="150" y="50" width="160" height="30" rx="4" fill="#e8e8e8" stroke="#cccccc"/>
          <rect x="70" y="60" width="70" height="25" rx="4" fill="#666666"/>
          <rect x="70" y="55" width="25" height="15" rx="2" fill="#555555"/>
          <rect x="130" y="75" width="180" height="5" fill="#cccccc"/>
          <circle cx="120" cy="95" r="12" fill="#444444"/>
          <circle cx="120" cy="95" r="6" fill="#eeeeee"/>
          <circle cx="280" cy="95" r="12" fill="#444444"/>
          <circle cx="280" cy="95" r="6" fill="#eeeeee"/>
        </svg>
      </div>
      <div className="h-px w-full bg-gray-e8e dark:bg-gray-dark-border my-4"></div>
      <p className="text-gray-dark-textSecondary leading-relaxed text-sm sm:text-base relative z-10">{description}</p>
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-gray-dark-border bg-gray-dark-card text-gray-dark-text font-medium shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-sm sm:text-base">
          {price}
        </div>
      </div>
      <div className="mt-4 sm:mt-5 flex items-center justify-center relative z-10">
        <button 
          onClick={onOrder}
          className="rounded-[14px] px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base cursor-pointer"
          type="button"
        >
          {t('containers.order')}
        </button>
      </div>
    </div>
  )
}

export default ContainerCard
