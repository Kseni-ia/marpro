'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

type ContainerCardProps = {
  volume: number
  dims: string
  description: string
  price: string
  image?: string
  onOrder: () => void
}

const ContainerCard: React.FC<ContainerCardProps> = ({ volume, dims, description, price, image, onOrder }) => {
  const { t } = useLanguage()
  
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-6 transition-all duration-300 hover:bg-white/10 overflow-hidden flex flex-col h-full max-w-[350px] mx-auto w-full">
      {/* Header: Volume & Dims */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white tracking-tight">
              {volume}
            </span>
            <span className="text-xl font-medium text-gray-400">m³</span>
          </div>
          <span className="text-sm text-gray-400 font-medium">kontejner</span>
        </div>
        
        {dims && (
          <div className="text-sm font-medium text-gray-400">
            {dims}
          </div>
        )}
      </div>

      {/* Container Image Area */}
      <div className="flex-1 flex items-center justify-center py-4 relative min-h-[120px]">
        <div className="relative w-full h-28 transition-transform duration-300 group-hover:scale-105">
          {image && image.startsWith('/') ? (
            <Image 
              src={image} 
              alt={`${volume}m³ container`}
              fill
              className="object-contain"
            />
          ) : (
            // Fallback SVG
            <svg viewBox="0 0 360 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`grad-${volume}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect x="150" y="50" width="160" height="30" rx="4" fill={`url(#grad-${volume})`} stroke="#d1d5db" strokeWidth="2"/>
              <rect x="70" y="60" width="70" height="25" rx="4" fill="#4b5563"/>
              <rect x="70" y="55" width="25" height="15" rx="2" fill="#374151"/>
              <rect x="130" y="75" width="180" height="6" fill="#9ca3af"/>
              <circle cx="120" cy="95" r="12" fill="#1f2937"/>
              <circle cx="120" cy="95" r="5" fill="#4b5563"/>
              <circle cx="280" cy="95" r="12" fill="#1f2937"/>
              <circle cx="280" cy="95" r="5" fill="#4b5563"/>
            </svg>
          )}
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
          className="py-2.5 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs transition-colors duration-200 text-center"
          type="button"
        >
          {t('containers.order')}
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

export default ContainerCard
