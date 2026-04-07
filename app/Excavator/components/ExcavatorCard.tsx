'use client'

import React from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getExcavatorAccent } from '@/lib/excavatorAccent'

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
  const accent = getExcavatorAccent(type)
  
  return (
    <div
      className="group relative mx-auto flex h-full w-full max-w-[350px] flex-col overflow-hidden rounded-[20px] border bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
      style={{
        borderColor: accent.border,
        boxShadow: `0 20px 45px rgba(0,0,0,0.18), inset 0 1px 0 ${accent.border}`,
      }}
    >
      {/* Header: Model & Type */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold tracking-tight"
              style={{ color: accent.text }}
            >
              {model}
            </span>
          </div>
          <span className="text-sm text-gray-400 font-medium">{type}</span>
        </div>

        <div
          className="rounded-full px-3 py-1 text-sm font-medium capitalize"
          style={{
            color: accent.text,
            backgroundColor: accent.tintStrong,
            border: `1px solid ${accent.border}`,
          }}
        >
          {type}
        </div>
      </div>

      {/* Excavator Image Area */}
      <div className="relative flex min-h-[140px] flex-1 items-center justify-center py-4">
        <div
          className="relative h-32 w-full overflow-hidden rounded-[18px] border p-3 transition-transform duration-300 group-hover:scale-105"
          style={{
            borderColor: accent.border,
            background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, ${accent.tint} 100%)`,
          }}
        >
          <Image 
            src={imageUrl || svgPath} 
            alt={`${model} excavator`} 
            fill
            sizes="(min-width: 1536px) 280px, (min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Specs Grid */}
      <div
        className="mb-4 grid grid-cols-3 gap-2 rounded-[16px] px-3 py-3"
        style={{
          border: `1px solid ${accent.border}`,
          backgroundColor: accent.tint,
        }}
      >
        <div className="text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Bucket</div>
          <div className="text-xs font-semibold" style={{ color: accent.text }}>{specs.bucketCapacity}</div>
        </div>
        <div className="text-center border-l border-r" style={{ borderColor: accent.border }}>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Reach</div>
          <div className="text-xs font-semibold" style={{ color: accent.text }}>{specs.maxReach}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Weight</div>
          <div className="text-xs font-semibold" style={{ color: accent.text }}>{specs.weight}</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 min-h-[48px]">
        <p className="line-clamp-3 text-center text-xs leading-relaxed text-gray-300">
          {description}
        </p>
      </div>

      {/* Price Box */}
      <div className="mb-4 border border-white/10 rounded-xl py-3 px-4 text-center bg-white/5">
        <span className="font-bold text-sm" style={{ color: accent.text }}>
          {price}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onOrder}
          className="rounded-xl bg-yellow-500 px-4 py-2.5 text-center text-xs font-bold text-black transition-colors duration-200 hover:bg-yellow-400 hover:shadow-yellow-500/20"
          type="button"
        >
          {t('excavators.order')}
        </button>
        <button 
          onClick={onOrder}
          className="rounded-xl border bg-transparent px-4 py-2.5 text-center text-xs font-semibold text-white transition-colors duration-200 hover:bg-white/5"
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

export default ExcavatorCard
