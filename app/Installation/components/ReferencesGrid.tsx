'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { Reference } from '@/lib/constructions'
import {
  getReferenceImageUrl,
  getReferenceVideoPosterUrl,
  isCloudinaryImageUrl,
  isCloudinaryVideoUrl,
  isVideoUrl,
} from '@/lib/referenceImageUrl'

type ReferencesGridProps = {
  title: string
  references: Reference[]
  onSelect: (reference: Reference) => void
}

export default function ReferencesGrid({
  title,
  references,
  onSelect,
}: ReferencesGridProps) {
  if (references.length === 0) {
    return null
  }

  return (
    <div className="mx-auto mb-8 max-w-[1800px] sm:mb-12">
      <h2 className="mb-4 text-center text-[1.55rem] font-bold uppercase text-gray-dark-text sm:mb-8 sm:text-3xl md:text-4xl">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {references.map((reference, index) => {
            const coverUrl = reference.imageUrls?.[0]
            const coverIsVideo = isVideoUrl(coverUrl)
            const coverSrc = coverIsVideo
              ? getReferenceVideoPosterUrl(coverUrl, 'grid')
              : getReferenceImageUrl(coverUrl, 'grid')
            const hasVideo = reference.imageUrls?.some((url) => isVideoUrl(url)) ?? false

            return (
            <div
              key={reference.id}
              className="group overflow-hidden rounded-xl border border-red-900/30 bg-gradient-to-br from-red-900/20 via-gray-800/30 to-red-800/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/20"
            >
              <div
                className="relative aspect-video cursor-pointer bg-gray-dark-bg/50"
                onClick={() => onSelect(reference)}
              >
                {reference.imageUrls && reference.imageUrls.length > 0 ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={coverSrc}
                      alt={reference.title}
                      width={800}
                      height={600}
                      sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={index < 4}
                      unoptimized={isCloudinaryImageUrl(coverSrc) || isCloudinaryVideoUrl(coverUrl)}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/placeholder-image.svg'
                      }}
                    />

                    {coverIsVideo && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 translate-x-[1px] fill-white" />
                        </div>
                      </div>
                    )}

                    {hasVideo && !coverIsVideo && (
                      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm">
                        <Play className="h-3 w-3 fill-white" />
                        Video
                      </div>
                    )}

                    {reference.imageUrls.length > 1 && (
                      <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <div className="mb-4 flex items-center justify-center">
                          <div className="flex gap-1">
                            {reference.imageUrls.slice(0, 5).map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-2 rounded-full ${
                                  index === 0 ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {reference.imageUrls.length > 1 ? 'Zobrazit všechny' : 'Zvětšit'}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-dark-textSecondary">
                    <div className="text-center">
                      <div className="mb-1 text-2xl">📷</div>
                      <div className="text-xs">Žádné obrázky</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-b from-transparent to-red-900/10 p-4 sm:p-5">
                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-red-400 sm:mb-3 sm:text-xl">
                  {reference.title}
                </h3>
                <p className="line-clamp-4 text-sm leading-6 text-gray-300 sm:leading-relaxed">
                  {reference.description}
                </p>
              </div>
            </div>
            )
          })}
      </div>
    </div>
  )
}
