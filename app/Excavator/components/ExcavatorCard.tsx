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
  imageUrl?: string
  specs: {
    weight: string
    bucketCapacity: string
    maxReach: string
  }
  onOrder: () => void
}

const ExcavatorCard: React.FC<ExcavatorCardProps> = ({ model, type, description, price, svgPath, imageUrl, specs, onOrder }) => {
  const { t } = useLanguage()
  
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-6 transition-all duration-300 hover:bg-white/10 overflow-hidden flex flex-col h-full max-w-[350px] mx-auto w-full">
      {/* Header: Model & Type */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">
              {model}
            </span>
          </div>
          <span className="text-sm text-gray-400 font-medium">{type}</span>
        </div>
      </div>

      {/* Excavator Image Area */}
      <div className="flex-1 flex items-center justify-center py-4 relative min-h-[140px]">
        <div className="relative w-full h-32 transition-transform duration-300 group-hover:scale-105">
          <Image 
            src={imageUrl || svgPath} 
            alt={`${model} excavator`} 
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-white/5">
        <div className="text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Bucket</div>
          <div className="text-xs font-semibold text-white">{specs.bucketCapacity}</div>
        </div>
        <div className="text-center border-l border-r border-white/5">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Reach</div>
          <div className="text-xs font-semibold text-white">{specs.maxReach}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Weight</div>
          <div className="text-xs font-semibold text-white">{specs.weight}</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 min-h-[48px]">
        <p className="text-gray-300 text-xs leading-relaxed text-center line-clamp-3">
          {description}
        </p>
      </div>

      {/* Price Box */}
      <div className="mb-4 border border-white/10 rounded-xl py-3 px-4 text-center bg-white/5">
        <span className="text-white font-bold text-sm">
          {price}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onOrder}
          className="py-2.5 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs transition-colors duration-200 text-center shadow-lg hover:shadow-yellow-500/20"
          type="button"
        >
          {t('excavators.order')}
        </button>
        <button 
          onClick={onOrder}
          className="py-2.5 px-4 rounded-xl bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold text-xs transition-colors duration-200 text-center"
          type="button"
        >
          Detail
        </button>
      </div>
    </div>
  )
}

export default ExcavatorCard
