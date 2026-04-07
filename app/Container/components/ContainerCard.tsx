'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { getContainerAccent } from '@/lib/containerAccent'
import { isFramedContainerImage, resolveContainerImage } from '@/lib/containerImages'

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
  const accent = getContainerAccent(volume)
  const imageSrc = resolveContainerImage(image)
  const framedImage = isFramedContainerImage(image)
  
  return (
    <div
      className="group relative mx-auto flex h-full w-full max-w-[350px] flex-col overflow-hidden rounded-[20px] border bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
      style={{
        borderColor: accent.border,
        boxShadow: `0 20px 45px rgba(0,0,0,0.18), inset 0 1px 0 ${accent.border}`,
      }}
    >
      {/* Header: Volume & Dims */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span
              className="text-5xl font-bold tracking-tight"
              style={{ color: accent.text }}
            >
              {volume}
            </span>
            <span className="text-xl font-medium" style={{ color: accent.primary }}>m³</span>
          </div>
          <span className="text-sm text-gray-400 font-medium">kontejner</span>
        </div>
        
        {dims && (
          <div
            className="rounded-full px-3 py-1 text-sm font-medium"
            style={{
              color: accent.text,
              backgroundColor: accent.tintStrong,
              border: `1px solid ${accent.border}`,
            }}
          >
            {dims}
          </div>
        )}
      </div>

      {/* Container Image Area */}
      <div className="relative flex min-h-[120px] flex-1 items-center justify-center py-4">
        <div
          className="relative h-28 w-full overflow-hidden rounded-[18px] border p-3 transition-transform duration-300 group-hover:scale-105"
          style={{
            borderColor: accent.border,
            background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, ${accent.tint} 100%)`,
          }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${volume}m³ container`}
              fill
              sizes="(min-width: 1536px) 280px, (min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className={framedImage ? 'object-cover scale-[1.34]' : 'object-contain'}
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
        <p className="line-clamp-3 text-center text-xs leading-relaxed text-gray-300">
          {description}
        </p>
      </div>

      {/* Price Box */}
      <div
        className="mb-4 rounded-xl px-4 py-3 text-center"
        style={{
          border: `1px solid ${accent.border}`,
          backgroundColor: accent.tintStrong,
        }}
      >
        <span className="font-bold text-sm" style={{ color: accent.text }}>
          {price}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onOrder}
          className="rounded-xl bg-yellow-500 px-4 py-2.5 text-center text-xs font-bold text-black transition-colors duration-200 hover:bg-yellow-400"
          type="button"
        >
          {t('containers.order')}
        </button>
        <button 
          onClick={onOrder}
          className="rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-center text-xs font-semibold text-white transition-colors duration-200 hover:bg-white/5"
          style={{
            borderColor: accent.borderStrong,
          }}
          type="button"
        >
          Detail
        </button>
      </div>
    </div>
  )
}

export default ContainerCard
