'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import OrderForm from '@/components/OrderForm'
import WorkWithUs from './work/WorkWithUs'
import { getAllReferences, Reference, ReferenceCategory, REFERENCE_CATEGORIES } from '@/lib/constructions'

const Constructions: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<ReferenceCategory | null>(null)

  // Fetch references from Firebase
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const data = await getAllReferences()
        // Filter only active references
        const activeReferences = data.filter(ref => ref.isActive)
        setReferences(activeReferences)
      } catch (error) {
        console.error('Error fetching references:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferences()
  }, [])

  // Keyboard navigation for image viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedReference || !selectedReference.imageUrls) return

      switch (e.key) {
        case 'Escape':
          setSelectedReference(null)
          break
        case 'ArrowLeft':
          setCurrentImageIndex((prev) => 
            prev === 0 ? selectedReference.imageUrls!.length - 1 : prev - 1
          )
          break
        case 'ArrowRight':
          setCurrentImageIndex((prev) => 
            prev === selectedReference.imageUrls!.length - 1 ? 0 : prev + 1
          )
          break
      }
    }

    if (selectedReference) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedReference, currentImageIndex])

  // Get references for selected category
  const getCategoryReferences = (category: ReferenceCategory) => {
    return references.filter(ref => ref.category === category)
  }

  // Get category label
  const getCategoryLabel = (category: ReferenceCategory) => {
    const cat = REFERENCE_CATEGORIES.find(c => c.value === category)
    return cat ? cat.label : category
  }

  // Compact Czech Construction Services - Text-focused
  const constructionServices = [
    {
      icon: '🏢',
      title: 'Demolice',
      categoryKey: 'demolice' as ReferenceCategory,
      description: 'Provádíme kompletní a částečné demolice všech typů objektů včetně průmyslových budov, rodinných domů a interiérových prostor. Naše práce zahrnuje bezpečnou likvidaci stavebních materiálů, ekologickou recyklaci sutě a kompletní úklid pozemku po demolici. Zajišťujeme veškeré potřebné povolení, zajištění staveniště a profesionální projektový management.',
      features: ['Bezpečnost', 'Ekologie', 'Rychlost'],
      color: 'text-red-500'
    },
    {
      icon: '🔧',
      title: 'Instalace',
      categoryKey: 'instalace' as ReferenceCategory,
      description: 'Nabízíme profesionální instalatérské práce včetně vodovodních a kanalizačních systémů, elektroinstalací pro domácnosti i průmysl, a kompletní HVAC systémy pro vytápění, ventilaci a klimatizaci. Naši certifikovaní technici zajišťují kvalitní provedení, záruční servis a pravidelnou údržbu všech instalovaných systémů.',
      features: ['Kvalita', 'Spolehlivost', 'Servis'],
      color: 'text-blue-500'
    },
    {
      icon: '🏗️',
      title: 'Stavební práce',
      categoryKey: 'stavebni_prace' as ReferenceCategory,
      description: 'Realizujeme komplexní stavební úpravy, rekonstrukce a modernizace objektů. Naše služby zahrnují stavby na klíč, rekonstrukce bytů a domů, průmyslové stavby, zemní práce, betonáž, zednické práce a finální úpravy. Používáme moderní technologie a kvalitní materiály pro dlouhou životnost staveb.',
      features: ['Moderní technologie', 'Preciznost', 'Flexibilita'],
      color: 'text-green-500'
    },
    {
      icon: '🚛',
      title: 'Odvoz materiálu',
      categoryKey: 'odvoz_materialu' as ReferenceCategory,
      description: 'Zajišťujeme ekologický odvoz a likvidaci stavebního odpadu, sutě a nebezpečných materiálů v souladu s legislativními požadavky. Naše vozový park umožňuje rychlý odvoz materiálu přímo ze staveniště, třídění odpadu pro recyklaci a přepravu na autorizované skládky. Vystavujeme potřebné doklady o nakládání s odpady.',
      features: ['Ekologický přístup', 'Efektivita', 'Legislativa'],
      color: 'text-yellow-500'
    }
  ]

  return (
    <>
      <TopNavigation />
      
      {/* Full Screen Blur-Up Background */}
      <BlurUpBackground
        placeholderSrc="/loadC_Small.jpeg"
        fullSrc="/constructions F.mp4"
        overlayOpacity="bg-black/70"
        isVideo={true}
      />
      
      <div className="relative min-h-screen z-10 pt-16">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 animate-fade-in min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-6 sm:mb-8 pb-3 sm:pb-4 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
          Stavby
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
        </h1>
        
        <p className="text-gray-dark-textSecondary text-center text-base sm:text-lg md:text-xl mb-8 max-w-4xl mx-auto">
          Kompletní stavební služby včetně demolice, instalací a odvozu materiálu
        </p>

        {/* Compact Text-focused Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto mb-12">
          {constructionServices.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:translate-x-2 border border-gray-dark-border/50 rounded-lg p-5 bg-gradient-card-dark/50 hover:border-gray-dark-border/80"
              onClick={() => setSelectedCategory(service.categoryKey)}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl sm:text-3xl ${service.color} flex-shrink-0 mt-1`}>
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl sm:text-2xl font-bold ${service.color} mb-2 group-hover:underline`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-dark-textSecondary text-sm sm:text-base leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {service.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className={`text-xs font-medium ${service.color} opacity-80`}
                      >
                        • {feature}
                      </span>
                    ))}
                    <span className={`text-xs font-semibold ${service.color} ml-auto group-hover:underline`}>
                      Reference →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reference Section */}
        <div className="max-w-[1800px] mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-dark-text text-center mb-8 font-bold uppercase">
            Reference
          </h2>
          
          {/* Reference Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-dark-textSecondary text-lg">Načítání referencí...</div>
            </div>
          ) : references.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {references.map((reference) => (
                <div
                  key={reference.id}
                  className="group bg-gradient-to-br from-red-900/20 via-gray-800/30 to-red-800/20 border border-red-900/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.02] backdrop-blur-sm"
                >
                  {/* Reference Images */}
                  <div className="aspect-video bg-gray-dark-bg/50 relative cursor-pointer" onClick={() => {
                    setSelectedReference(reference)
                    setCurrentImageIndex(0)
                  }}>
                    {(reference.imageUrls && reference.imageUrls.length > 0) ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={reference.imageUrls[0]}
                          alt={reference.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg'
                          }}
                        />
                        
                        {/* Overlay for additional images */}
                        {reference.imageUrls.length > 1 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pointer-events-none">
                            <div className="flex items-center justify-center mb-4">
                              <div className="flex gap-1">
                                {reference.imageUrls.slice(0, 5).map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                      index === 0 ? 'bg-white' : 'bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Click hint */}
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {reference.imageUrls.length > 1 ? 'Zobrazit všechny' : 'Zvětšit'}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-dark-textSecondary">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📷</div>
                          <div className="text-xs">Žádné obrázky</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reference Content */}
                  <div className="p-5 bg-gradient-to-b from-transparent to-red-900/10">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                      {reference.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                      {reference.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 border-2 border-dashed border-gray-dark-border/50 rounded-lg">
              <div className="text-center">
                <div className="text-gray-dark-textSecondary text-lg mb-4">
                  Žádné reference k zobrazení
                </div>
                <div className="text-gray-dark-textSecondary/60 text-sm">
                  Reference budou přidány administrátorem
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Order Button */}
      <div className="text-center mt-8">
        <button 
          onClick={() => setShowOrderForm(true)}
          className="rounded-[14px] px-8 sm:px-10 py-4 sm:py-5 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-lg sm:text-xl hover:scale-105"
        >
          Objednat stavbu
        </button>
      </div>

      {/* Work With Us Button */}
      <WorkWithUs />
        
        {showOrderForm && (
          <OrderForm
            serviceType="constructions"
            onClose={() => setShowOrderForm(false)}
          />
        )}

        {/* Category Gallery Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black/90 z-[9998] flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-6xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute -top-2 -right-2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
                title="Zavřít"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Category Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {getCategoryLabel(selectedCategory)}
                </h2>
                <p className="text-gray-400">
                  {getCategoryReferences(selectedCategory).length} {getCategoryReferences(selectedCategory).length === 1 ? 'reference' : getCategoryReferences(selectedCategory).length < 5 ? 'reference' : 'referencí'}
                </p>
              </div>

              {/* References Grid */}
              {getCategoryReferences(selectedCategory).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCategoryReferences(selectedCategory).map((reference) => (
                    <div
                      key={reference.id}
                      className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.02] backdrop-blur-sm cursor-pointer"
                      onClick={() => {
                        setSelectedReference(reference)
                        setCurrentImageIndex(0)
                      }}
                    >
                      {/* Reference Image */}
                      <div className="aspect-video bg-gray-dark-bg/50 relative">
                        {(reference.imageUrls && reference.imageUrls.length > 0) ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={reference.imageUrls[0]}
                              alt={reference.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg'
                              }}
                            />
                            
                            {/* Image count indicator */}
                            {reference.imageUrls.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                +{reference.imageUrls.length - 1} foto
                              </div>
                            )}
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                Zobrazit galerii
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <div className="text-2xl mb-1">📷</div>
                              <div className="text-xs">Žádné obrázky</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reference Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                          {reference.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {reference.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 border-2 border-dashed border-gray-600/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-400 text-lg mb-4">
                      Žádné reference v této kategorii
                    </div>
                    <div className="text-gray-500 text-sm">
                      Reference budou přidány administrátorem
                    </div>
                  </div>
                </div>
              )}

              {/* Order Button */}
              <div className="text-center mt-8">
                <button 
                  onClick={() => {
                    setSelectedCategory(null)
                    setShowOrderForm(true)
                  }}
                  className="rounded-[14px] px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg hover:shadow-red-600/30 transition-all hover:scale-105"
                >
                  Objednat {getCategoryLabel(selectedCategory)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {selectedReference && (
          <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => setSelectedReference(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Zavřít"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Navigation */}
              {selectedReference.imageUrls && selectedReference.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === 0 ? selectedReference.imageUrls!.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    title="Předchozí"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === selectedReference.imageUrls!.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    title="Další"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Current Image */}
              <div className="relative w-full h-full flex items-center justify-center mb-4">
                <Image
                  src={selectedReference.imageUrls?.[currentImageIndex] || '/placeholder-image.jpg'}
                  alt={`${selectedReference.title} ${currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[60vh] object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg'
                  }}
                />
              </div>

              {/* Image Info - Below Image */}
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-2">
                  {selectedReference.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-2xl mx-auto">
                  {selectedReference.description}
                </p>
                {selectedReference.imageUrls && selectedReference.imageUrls.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="flex gap-1">
                      {selectedReference.imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      </div>
    </>
  )
}

export default Constructions
