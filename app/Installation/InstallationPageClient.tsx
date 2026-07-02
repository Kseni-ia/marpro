'use client'

import { useEffect, useMemo, useState } from 'react'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import OrderForm from '@/components/OrderForm'
import WorkWithUs from '@/app/Installation/work/WorkWithUs'
import { getAllReferences, Reference } from '@/lib/constructions'
import { isVideoUrl } from '@/lib/referenceImageUrl'
import { useLanguage } from '@/contexts/LanguageContext'
import { getInstallationCopy } from '@/lib/installationCopy'
import InstallationHero from './components/InstallationHero'
import ReferencesGrid from './components/ReferencesGrid'
import ReferenceGalleryModal from './components/ReferenceGalleryModal'

type InstallationPageClientProps = {
  initialReferences?: Reference[]
}

export default function InstallationPageClient({
  initialReferences = [],
}: InstallationPageClientProps) {
  const { language } = useLanguage()
  const copy = getInstallationCopy(language)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [references, setReferences] = useState<Reference[]>(initialReferences)
  const [loading, setLoading] = useState(initialReferences.length === 0)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)

  // Each reference is split into a photos-only and a videos-only view so the two
  // media types can live in separate sections. A reference with both appears in
  // both sections, filtered to the relevant media.
  const photoReferences = useMemo(
    () =>
      references
        .map((reference) => ({
          ...reference,
          imageUrls: reference.imageUrls.filter((url) => !isVideoUrl(url)),
        }))
        .filter((reference) => reference.imageUrls.length > 0),
    [references]
  )

  const videoReferences = useMemo(
    () =>
      references
        .map((reference) => ({
          ...reference,
          imageUrls: reference.imageUrls.filter((url) => isVideoUrl(url)),
        }))
        .filter((reference) => reference.imageUrls.length > 0),
    [references]
  )

  useEffect(() => {
    if (initialReferences.length > 0) {
      return
    }

    let isCancelled = false

    const fetchReferences = async () => {
      try {
        const data = await getAllReferences()
        if (!isCancelled) {
          setReferences(data.filter((reference) => reference.isActive))
        }
      } catch (error) {
        console.error('Error fetching references:', error)
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchReferences()

    return () => {
      isCancelled = true
    }
  }, [initialReferences])

  return (
    <>
      <TopNavigation />

      <BlurUpBackground
        placeholderSrc="/plumbing_small.jpeg"
        fullSrc="/plumbing_bg.jpeg"
        overlayOpacity="bg-black/70"
        isVideo={false}
      />

      <div className="relative z-10 min-h-screen pt-16">
        <div className="relative z-10 min-h-screen animate-fade-in px-3 py-3 sm:p-6 md:p-8">
          <InstallationHero />

          <div id="reference" className="scroll-mt-24" />

          {loading ? (
            <div className="mx-auto mb-8 flex max-w-[1800px] items-center justify-center py-20 sm:mb-12">
              <div className="text-lg text-gray-dark-textSecondary">Načítání referencí...</div>
            </div>
          ) : references.length === 0 ? (
            <div className="mx-auto mb-8 flex max-w-[1800px] items-center justify-center rounded-lg border-2 border-dashed border-gray-dark-border/50 py-20 sm:mb-12">
              <div className="text-center">
                <div className="mb-4 text-lg text-gray-dark-textSecondary">
                  Žádné reference k zobrazení
                </div>
                <div className="text-sm text-gray-dark-textSecondary/60">
                  Reference budou přidány administrátorem
                </div>
              </div>
            </div>
          ) : (
            <>
              <ReferencesGrid
                title="Reference"
                references={photoReferences}
                onSelect={setSelectedReference}
              />
              <ReferencesGrid
                title="Videa"
                references={videoReferences}
                onSelect={setSelectedReference}
              />
            </>
          )}

          <div className="mt-6 text-center sm:mt-8">
            <button
              onClick={() => setShowOrderForm(true)}
              className="rounded-[14px] bg-gradient-button-dark px-6 py-3 text-base font-semibold text-gray-dark-text shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:px-10 sm:py-5 sm:text-xl"
            >
              {copy.cta}
            </button>
          </div>

          <WorkWithUs />

          {showOrderForm && (
            <OrderForm
              serviceType="constructions"
              onClose={() => setShowOrderForm(false)}
            />
          )}

          {selectedReference && (
            <ReferenceGalleryModal
              reference={selectedReference}
              onClose={() => setSelectedReference(null)}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  )
}
