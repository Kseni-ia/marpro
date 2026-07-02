'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ImageIcon, Play } from 'lucide-react'
import { Reference } from '@/lib/constructions'
import {
  getReferenceImageUrl,
  getReferenceVideoPosterUrl,
  isCloudinaryImageUrl,
  isCloudinaryVideoUrl,
  isVideoUrl,
} from '@/lib/referenceImageUrl'

type ReferencesTeaserProps = {
  references: Reference[]
}

const MAX_THUMBS = 5

export default function ReferencesTeaser({ references }: ReferencesTeaserProps) {
  // Don't advertise references we don't have.
  if (!references || references.length === 0) {
    return null
  }

  const hasAnyVideo = references.some((reference) =>
    reference.imageUrls?.some((url) => isVideoUrl(url))
  )

  const thumbs = references
    .filter((reference) => reference.imageUrls && reference.imageUrls.length > 0)
    .slice(0, MAX_THUMBS)
    .map((reference) => {
      const coverUrl = reference.imageUrls[0]
      const isVideo = isVideoUrl(coverUrl)
      return {
        id: reference.id,
        title: reference.title,
        isVideo,
        src: isVideo
          ? getReferenceVideoPosterUrl(coverUrl, 'grid')
          : getReferenceImageUrl(coverUrl, 'grid'),
        unoptimized: isCloudinaryImageUrl(coverUrl) || isCloudinaryVideoUrl(coverUrl),
      }
    })

  const extraCount = Math.max(0, references.length - thumbs.length)

  return (
    <section className="mx-auto mt-14 w-full max-w-[1080px] px-4 sm:mt-20">
      <Link
        href="/Installation"
        className="group block overflow-hidden rounded-[28px] border border-red-900/40 bg-gradient-to-br from-red-950/40 via-gray-dark-card/70 to-gray-dark-card/50 p-6 text-left shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-[0_0_28px_rgba(239,68,68,0.22)] sm:p-8"
      >
        <div className="flex flex-col items-center gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
          {/* Copy */}
          <div className="text-center md:flex-1 md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              <ImageIcon className="h-3 w-3" />
              Reference
            </span>

            <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight text-gray-dark-text sm:text-3xl">
              Podívejte se na naše realizace
            </h2>

            <p className="mx-auto mt-2 max-w-[440px] text-sm leading-relaxed text-gray-dark-textSecondary md:mx-0 sm:text-base">
              {hasAnyVideo
                ? 'Fotografie a videa z našich dokončených projektů.'
                : 'Fotografie z našich dokončených projektů.'}
              {' '}
              <span className="whitespace-nowrap font-semibold text-gray-200">
                {references.length}{' '}
                {references.length === 1
                  ? 'zveřejněná reference'
                  : references.length >= 2 && references.length <= 4
                    ? 'zveřejněné reference'
                    : 'zveřejněných referencí'}
                .
              </span>
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-[14px] bg-gradient-button-dark px-5 py-2.5 text-sm font-semibold text-gray-dark-text shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-[1.04] sm:text-base">
              Zobrazit reference
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>

          {/* Thumbnail stack */}
          <div className="flex items-center -space-x-4 sm:-space-x-5">
            {thumbs.map((thumb, index) => (
              <div
                key={thumb.id}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-gray-dark-card bg-gray-dark-bg/60 shadow-lg transition-transform duration-300 group-hover:translate-y-0 sm:h-24 sm:w-24"
                style={{
                  zIndex: thumbs.length - index,
                  transform: `rotate(${(index - (thumbs.length - 1) / 2) * 4}deg)`,
                }}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.title}
                  width={200}
                  height={200}
                  unoptimized={thumb.unoptimized}
                  className="h-full w-full object-cover"
                />
                {thumb.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/30">
                      <Play className="h-3.5 w-3.5 translate-x-[1px] fill-white" />
                    </span>
                  </div>
                )}
              </div>
            ))}

            {extraCount > 0 && (
              <div
                className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-dark-card bg-red-950/70 text-lg font-bold text-red-200 shadow-lg sm:h-24 sm:w-24"
                style={{ transform: `rotate(${((thumbs.length) - (thumbs.length - 1) / 2) * 4}deg)` }}
              >
                +{extraCount}
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  )
}
