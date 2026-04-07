'use client'

import React, { useEffect, useState } from 'react'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatPriceListPrice, getActivePriceListItems, PriceListItem } from '@/lib/priceList'
import { getPriceListCopy } from '@/lib/priceListCopy'

export default function CenikPageClient() {
  const { language } = useLanguage()
  const copy = getPriceListCopy(language)
  const [items, setItems] = useState<PriceListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getActivePriceListItems()
      setItems(data)
      setLoading(false)
    }

    fetchItems()
  }, [])

  return (
    <>
      <TopNavigation />

      <BlurUpBackground
        placeholderSrc="/loadC_Small.jpeg"
        fullSrc="/F4.mp4"
        overlayOpacity="bg-black/80"
        isVideo={true}
      />

      <div className="relative z-10 flex min-h-screen flex-col pt-16">
        <main className="flex-1">
          <div className="mx-auto max-w-6xl animate-fade-in px-4 py-6 sm:px-6 md:px-8 md:py-10">
          <h1 className="relative mb-3 pb-3 text-center text-3xl font-extrabold uppercase tracking-[1px] text-gray-dark-text shadow-text sm:text-4xl md:text-5xl">
            {copy.title}
            <span className="absolute bottom-0 left-1/2 h-1 w-[70px] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent"></span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-center text-sm text-gray-dark-textSecondary sm:text-base">
            {copy.subtitle}
          </p>

          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_45px_rgba(0,0,0,0.18)] backdrop-blur-md mt-8">
            <div className="hidden border-b border-white/10 bg-white/5 px-6 py-4 md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(180px,0.55fr)] md:gap-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                {copy.serviceLabel}
              </div>
              <div className="text-right text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                {copy.priceLabel}
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-dark-textSecondary">{copy.loading}</div>
            ) : items.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-dark-textSecondary">{copy.emptyState}</div>
            ) : (
              <div className="divide-y divide-white/10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.7fr)_minmax(180px,0.55fr)] md:gap-6 md:px-6 transition-colors duration-300 hover:bg-white/10 group cursor-pointer"
                  >
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">{item.name}</h2>
                    </div>
                    <div className="flex items-start md:justify-end items-center">
                      <span className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-yellow-500 shadow-sm transition-all group-hover:bg-white/10 group-hover:border-white/20">
                        {formatPriceListPrice(item)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
