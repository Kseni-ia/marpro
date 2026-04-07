'use client'

import { useEffect, useState } from 'react'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import OrderForm from '@/components/OrderForm'
import WorkWithUs from '@/app/Installation/work/WorkWithUs'
import { getAllReferences, Reference } from '@/lib/constructions'
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
        placeholderSrc="/loadC_Small.jpeg"
        fullSrc="/constructions F.mp4"
        overlayOpacity="bg-black/70"
        isVideo={true}
      />

      <div className="relative z-10 min-h-screen pt-16">
        <div className="relative z-10 min-h-screen animate-fade-in px-3 py-3 sm:p-6 md:p-8">
          <InstallationHero />

          <ReferencesGrid
            loading={loading}
            references={references}
            onSelect={setSelectedReference}
          />

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
