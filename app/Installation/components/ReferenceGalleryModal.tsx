'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Reference } from '@/lib/constructions'
import { getReferenceImageUrl } from '@/lib/referenceImageUrl'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

type DragState = {
  isDragging: boolean
  pointerId: number | null
  startX: number
  startY: number
  originX: number
  originY: number
}

type ReferenceGalleryModalProps = {
  reference: Reference
  onClose: () => void
}

export default function ReferenceGalleryModal({
  reference,
  onClose,
}: ReferenceGalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(MIN_ZOOM)
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  const imageCount = reference.imageUrls?.length ?? 0
  const hasMultipleImages = imageCount > 1
  const SWIPE_THRESHOLD = 50

  const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))

  const resetImageTransform = () => {
    setImageZoom(MIN_ZOOM)
    setImageOffset({ x: 0, y: 0 })
  }

  const changeImage = (direction: 1 | -1) => {
    setCurrentImageIndex((prev) => (prev + imageCount + direction) % imageCount)
    resetImageTransform()
  }

  const zoomIn = () => {
    setImageZoom((prev) => clampZoom(prev + ZOOM_STEP))
  }

  const zoomOut = () => {
    setImageZoom((prev) => clampZoom(prev - ZOOM_STEP))
  }

  const stopDragging = () => {
    dragStateRef.current.isDragging = false
    dragStateRef.current.pointerId = null
  }

  const handleSwipe = () => {
    if (!hasMultipleImages || imageZoom > MIN_ZOOM || touchStartX === null || touchEndX === null) {
      return
    }

    const swipeDistance = touchStartX - touchEndX

    if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) {
      return
    }

    if (swipeDistance > 0) {
      changeImage(1)
      return
    }

    changeImage(-1)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          resetImageTransform()
          break
        case 'ArrowLeft':
          if (hasMultipleImages) {
            changeImage(-1)
          }
          break
        case 'ArrowRight':
          if (hasMultipleImages) {
            changeImage(1)
          }
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

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
      stopDragging()
    }
  }, [hasMultipleImages, imageCount, onClose])

  useEffect(() => {
    if (imageZoom <= MIN_ZOOM && (imageOffset.x !== 0 || imageOffset.y !== 0)) {
      setImageOffset({ x: 0, y: 0 })
    }
  }, [imageOffset.x, imageOffset.y, imageZoom])

  if (!reference.imageUrls || reference.imageUrls.length === 0) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black"
      onClick={() => {
        onClose()
        resetImageTransform()
      }}
    >
      <div className="relative h-[100dvh] w-screen overflow-hidden">
        <button
          onClick={(event) => {
            event.stopPropagation()
            onClose()
            resetImageTransform()
          }}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
          title="Zavřít"
        >
          <X className="h-6 w-6" />
        </button>

        {hasMultipleImages && (
          <>
            <button
              onClick={(event) => {
                event.stopPropagation()
                changeImage(-1)
              }}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition-colors hover:bg-black/80"
              title="Předchozí"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation()
                changeImage(1)
              }}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition-colors hover:bg-black/80"
              title="Další"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div
          className="absolute left-4 top-4 z-20 flex items-center gap-2"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={zoomOut}
            disabled={imageZoom <= MIN_ZOOM}
            className="rounded-full bg-black/60 px-3 py-2 text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            title="Oddálit"
          >
            -
          </button>
          <button
            onClick={resetImageTransform}
            disabled={imageZoom === MIN_ZOOM}
            className="rounded-full bg-black/60 px-3 py-2 text-sm text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            title="Reset zoomu"
          >
            {Math.round(imageZoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={imageZoom >= MAX_ZOOM}
            className="rounded-full bg-black/60 px-3 py-2 text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            title="Přiblížit"
          >
            +
          </button>
        </div>

        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
          onWheel={(event) => {
            event.preventDefault()

            if (event.deltaY < 0) {
              zoomIn()
              return
            }

            zoomOut()
          }}
          onTouchStart={(event) => {
            if (imageZoom > MIN_ZOOM) {
              return
            }

            setTouchEndX(null)
            setTouchStartX(event.targetTouches[0].clientX)
          }}
          onTouchMove={(event) => {
            if (imageZoom > MIN_ZOOM || touchStartX === null) {
              return
            }

            setTouchEndX(event.targetTouches[0].clientX)
          }}
          onTouchEnd={() => {
            handleSwipe()
            setTouchStartX(null)
            setTouchEndX(null)
          }}
        >
          <div
            className="flex max-h-[100dvh] max-w-[100vw] items-center justify-center"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={getReferenceImageUrl(reference.imageUrls[currentImageIndex])}
              alt={`${reference.title} ${currentImageIndex + 1}`}
              width={1800}
              height={1200}
              draggable={false}
              className={`max-h-[100dvh] max-w-[100vw] h-auto w-auto select-none object-contain transition-transform duration-200 ${
                imageZoom > MIN_ZOOM
                  ? 'cursor-grab active:cursor-grabbing touch-none'
                  : 'cursor-zoom-in'
              }`}
              style={{
                transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageZoom})`,
              }}
              onDoubleClick={() => {
                if (imageZoom === MIN_ZOOM) {
                  setImageZoom(2)
                  setImageOffset({ x: 0, y: 0 })
                  return
                }

                resetImageTransform()
              }}
              onPointerDown={(event) => {
                if (imageZoom <= MIN_ZOOM) {
                  return
                }

                event.preventDefault()
                event.currentTarget.setPointerCapture(event.pointerId)

                dragStateRef.current = {
                  isDragging: true,
                  pointerId: event.pointerId,
                  startX: event.clientX,
                  startY: event.clientY,
                  originX: imageOffset.x,
                  originY: imageOffset.y,
                }
              }}
              onPointerMove={(event) => {
                if (
                  !dragStateRef.current.isDragging ||
                  dragStateRef.current.pointerId !== event.pointerId ||
                  imageZoom <= MIN_ZOOM
                ) {
                  return
                }

                event.preventDefault()
                setImageOffset({
                  x: dragStateRef.current.originX + event.clientX - dragStateRef.current.startX,
                  y: dragStateRef.current.originY + event.clientY - dragStateRef.current.startY,
                })
              }}
              onPointerUp={(event) => {
                if (dragStateRef.current.pointerId === event.pointerId) {
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }
                stopDragging()
              }}
              onPointerCancel={(event) => {
                if (dragStateRef.current.pointerId === event.pointerId) {
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }
                stopDragging()
              }}
              onError={(event) => {
                event.currentTarget.src = '/placeholder-image.jpg'
              }}
            />
          </div>
        </div>

        {hasMultipleImages && (
          <div
            className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/85 to-transparent px-6 pb-6 pt-20 text-center text-white"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex gap-1.5">
                {reference.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      resetImageTransform()
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
