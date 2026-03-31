'use client'

import Image from 'next/image'
import { Reference } from '@/lib/constructions'
import { getReferenceImageUrl } from '@/lib/referenceImageUrl'

type ReferencesGridProps = {
  loading: boolean
  references: Reference[]
  onSelect: (reference: Reference) => void
}

export default function ReferencesGrid({
  loading,
  references,
  onSelect,
}: ReferencesGridProps) {
  return (
    <div className="mx-auto mb-8 max-w-[1800px] sm:mb-12">
      <h2 className="mb-4 text-center text-[1.55rem] font-bold uppercase text-gray-dark-text sm:mb-8 sm:text-3xl md:text-4xl">
        Reference
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-dark-textSecondary">Načítání referencí...</div>
        </div>
      ) : references.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {references.map((reference) => (
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
                      src={getReferenceImageUrl(reference.imageUrls[0])}
                      alt={reference.title}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/placeholder-image.jpg'
                      }}
                    />

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
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-dark-border/50 py-20">
          <div className="text-center">
            <div className="mb-4 text-lg text-gray-dark-textSecondary">
              Žádné reference k zobrazení
            </div>
            <div className="text-sm text-gray-dark-textSecondary/60">
              Reference budou přidány administrátorem
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
