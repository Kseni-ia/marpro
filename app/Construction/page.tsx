'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import BlurUpBackground from '@/components/BlurUpBackground'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/app/Footer'
import OrderForm from '@/components/OrderForm'
import WorkWithUs from './work/WorkWithUs'
import { getAllReferences, Reference } from '@/lib/constructions'
import { getReferenceImageUrl } from '@/lib/referenceImageUrl'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25
const CONSTRUCTION_INTRO =
  'Nabizime profesionalni stavebni a instalacni prace pro bytove, komercni i prumyslove projekty. Zajistujeme realizaci na klic, rekonstrukce, technicke instalace i koordinaci navazujicich cinnosti s durazem na kvalitu provedeni, spolehlivost a dlouhodobou funkcnost.'

const Constructions: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(MIN_ZOOM)
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
  const dragStateRef = useRef<{
    isDragging: boolean
    pointerId: number | null
    startX: number
    startY: number
    originX: number
    originY: number
  }>({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  })

  const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))

  const zoomIn = () => {
    setImageZoom((prev) => clampZoom(prev + ZOOM_STEP))
  }

  const zoomOut = () => {
    setImageZoom((prev) => clampZoom(prev - ZOOM_STEP))
  }

  const resetZoom = () => {
    setImageZoom(MIN_ZOOM)
    setImageOffset({ x: 0, y: 0 })
  }

  const resetImageTransform = () => {
    setImageZoom(MIN_ZOOM)
    setImageOffset({ x: 0, y: 0 })
  }

  const stopDragging = () => {
    dragStateRef.current.isDragging = false
    dragStateRef.current.pointerId = null
  }

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
          resetImageTransform()
          break
        case 'ArrowLeft':
          setCurrentImageIndex((prev) => 
            prev === 0 ? selectedReference.imageUrls!.length - 1 : prev - 1
          )
          resetImageTransform()
          break
        case 'ArrowRight':
          setCurrentImageIndex((prev) => 
            prev === selectedReference.imageUrls!.length - 1 ? 0 : prev + 1
          )
          resetImageTransform()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
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
      stopDragging()
    }
  }, [selectedReference, currentImageIndex])

  useEffect(() => {
    if (imageZoom <= MIN_ZOOM && (imageOffset.x !== 0 || imageOffset.y !== 0)) {
      setImageOffset({ x: 0, y: 0 })
    }
  }, [imageZoom, imageOffset.x, imageOffset.y])

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
          Kompletní stavebni a instalacni servis pro moderni realizace a rekonstrukce
        </p>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-800/55 to-red-950/45 backdrop-blur-md px-6 py-8 sm:px-8 sm:py-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-3xl text-blue-400 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.25)]">
                🔧
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Instalace a realizace staveb
                </h2>
                <p className="text-gray-200/90 text-base sm:text-lg leading-relaxed max-w-4xl">
                  {CONSTRUCTION_INTRO}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-blue-300">
                    Kvalita provedeni
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-200">
                    Spolehlivost
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-200">
                    Rekonstrukce
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-200">
                    Realizace na klic
                  </span>
                </div>
              </div>
            </div>
          </div>
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
                    resetImageTransform()
                  }}>
                    {(reference.imageUrls && reference.imageUrls.length > 0) ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getReferenceImageUrl(reference.imageUrls[0])}
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

        {/* Image Viewer Modal */}
        {selectedReference && (
          <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedReference(null)
                  resetImageTransform()
                }}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Zavřít"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Navigation */}
              {selectedReference.imageUrls && selectedReference.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setCurrentImageIndex((prev) => 
                        prev === 0 ? selectedReference.imageUrls!.length - 1 : prev - 1
                      )
                      resetImageTransform()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    title="Předchozí"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentImageIndex((prev) => 
                        prev === selectedReference.imageUrls!.length - 1 ? 0 : prev + 1
                      )
                      resetImageTransform()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    title="Další"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <button
                  onClick={zoomOut}
                  disabled={imageZoom <= MIN_ZOOM}
                  className="bg-black/50 hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-full transition-colors"
                  title="Oddálit"
                >
                  -
                </button>
                <button
                  onClick={resetZoom}
                  disabled={imageZoom === MIN_ZOOM}
                  className="bg-black/50 hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-full transition-colors text-sm"
                  title="Reset zoomu"
                >
                  {Math.round(imageZoom * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  disabled={imageZoom >= MAX_ZOOM}
                  className="bg-black/50 hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-full transition-colors"
                  title="Přiblížit"
                >
                  +
                </button>
              </div>

              {/* Current Image */}
              <div
                className="relative w-full h-full flex items-center justify-center mb-4 overflow-hidden"
                onWheel={(e) => {
                  e.preventDefault()
                  if (e.deltaY < 0) {
                    zoomIn()
                    return
                  }

                  zoomOut()
                }}
              >
                <Image
                  src={getReferenceImageUrl(selectedReference.imageUrls?.[currentImageIndex])}
                  alt={`${selectedReference.title} ${currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  draggable={false}
                  className={`max-w-full max-h-[60vh] object-contain transition-transform duration-200 select-none ${imageZoom > MIN_ZOOM ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-zoom-in'}`}
                  style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageZoom})` }}
                  onDoubleClick={() => {
                    if (imageZoom === MIN_ZOOM) {
                      setImageZoom(2)
                      setImageOffset({ x: 0, y: 0 })
                      return
                    }

                    resetImageTransform()
                  }}
                  onPointerDown={(e) => {
                    if (imageZoom <= MIN_ZOOM) {
                      return
                    }

                    e.preventDefault()
                    e.currentTarget.setPointerCapture(e.pointerId)

                    dragStateRef.current = {
                      isDragging: true,
                      pointerId: e.pointerId,
                      startX: e.clientX,
                      startY: e.clientY,
                      originX: imageOffset.x,
                      originY: imageOffset.y
                    }
                  }}
                  onPointerMove={(e) => {
                    if (
                      !dragStateRef.current.isDragging ||
                      dragStateRef.current.pointerId !== e.pointerId ||
                      imageZoom <= MIN_ZOOM
                    ) {
                      return
                    }

                    e.preventDefault()
                    setImageOffset({
                      x: dragStateRef.current.originX + e.clientX - dragStateRef.current.startX,
                      y: dragStateRef.current.originY + e.clientY - dragStateRef.current.startY
                    })
                  }}
                  onPointerUp={(e) => {
                    if (dragStateRef.current.pointerId === e.pointerId) {
                      e.currentTarget.releasePointerCapture(e.pointerId)
                    }
                    stopDragging()
                  }}
                  onPointerCancel={(e) => {
                    if (dragStateRef.current.pointerId === e.pointerId) {
                      e.currentTarget.releasePointerCapture(e.pointerId)
                    }
                    stopDragging()
                  }}
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
                          onClick={() => {
                            setCurrentImageIndex(index)
                            resetImageTransform()
                          }}
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
