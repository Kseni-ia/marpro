'use client'

import React, { useEffect, useRef, useState } from 'react'

interface BlurUpBackgroundProps {
  placeholderSrc: string
  fullSrc: string
  children?: React.ReactNode
  overlayOpacity?: string
  className?: string
  isVideo?: boolean
}

type NetworkInformationLike = {
  effectiveType?: string
  saveData?: boolean
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike
  mozConnection?: NetworkInformationLike
  webkitConnection?: NetworkInformationLike
}

type IdleRequestCallbackHandle = number

type WindowWithIdleCallback = Window & {
  cancelIdleCallback?: (handle: IdleRequestCallbackHandle) => void
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => IdleRequestCallbackHandle
}

const SMALL_SCREEN_MEDIA_QUERY = '(max-width: 768px)'
const SLOW_CONNECTION_TYPES = new Set(['slow-2g', '2g', '3g'])
const VIDEO_IDLE_TIMEOUT_MS = 2000
const VIDEO_LOAD_DELAY_MS = 1200

const BlurUpBackground: React.FC<BlurUpBackgroundProps> = ({
  placeholderSrc,
  fullSrc,
  children,
  overlayOpacity = 'bg-black/70',
  className = '',
  isVideo
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const revealTimerRef = useRef<number | null>(null)

  // Auto-detect if source is a video file
  const isVideoFile = isVideo !== undefined ? isVideo : fullSrc.match(/\.(mp4|webm|ogg|mov)$/i) !== null

  const clearRevealTimer = () => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
  }

  const revealLoadedMedia = (delayMs: number) => {
    setIsLoaded(true)
    clearRevealTimer()

    revealTimerRef.current = window.setTimeout(() => {
      setShowPlaceholder(false)
      revealTimerRef.current = null
    }, delayMs)
  }

  useEffect(() => {
    setIsLoaded(false)
    setShowPlaceholder(true)
    clearRevealTimer()

    return () => {
      clearRevealTimer()
    }
  }, [fullSrc])

  useEffect(() => {
    if (isVideoFile) {
      setShouldLoadVideo(false)

      const navigatorWithConnection = navigator as NavigatorWithConnection
      const windowWithIdleCallback = window as WindowWithIdleCallback
      const connection =
        navigatorWithConnection.connection ||
        navigatorWithConnection.mozConnection ||
        navigatorWithConnection.webkitConnection

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isSmallScreen = window.matchMedia(SMALL_SCREEN_MEDIA_QUERY).matches
      const saveDataEnabled = connection?.saveData === true
      const slowConnection =
        typeof connection?.effectiveType === 'string' &&
        SLOW_CONNECTION_TYPES.has(connection.effectiveType)

      if (prefersReducedMotion || isSmallScreen || saveDataEnabled || slowConnection) {
        return
      }

      let timeoutId: number | null = null
      let idleHandle: IdleRequestCallbackHandle | null = null

      const startVideoLoad = () => {
        timeoutId = window.setTimeout(() => {
          setShouldLoadVideo(true)
        }, VIDEO_LOAD_DELAY_MS)
      }

      if (windowWithIdleCallback.requestIdleCallback) {
        idleHandle = windowWithIdleCallback.requestIdleCallback(startVideoLoad, {
          timeout: VIDEO_IDLE_TIMEOUT_MS,
        })
      } else {
        startVideoLoad()
      }

      return () => {
        if (idleHandle !== null) {
          windowWithIdleCallback.cancelIdleCallback?.(idleHandle)
        }

        if (timeoutId !== null) {
          window.clearTimeout(timeoutId)
        }
      }
    }

    // For images, preload the full image
    const img = new window.Image()
    img.src = fullSrc

    img.onload = () => {
      revealLoadedMedia(100)
    }

    img.onerror = () => {
      // If full image fails to load, keep placeholder
      console.warn('Failed to load full background image:', fullSrc)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [fullSrc, isVideoFile])

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen overflow-hidden z-0 ${className}`}>
      {/* Placeholder image - visible immediately as clear background, stays until video is ready */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          showPlaceholder ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${placeholderSrc})`,
          zIndex: 1,
          backgroundColor: '#1a1a1a' // Dark background to prevent black flash
        }}
      />
      
      {/* Full video/image - fades in when ready */}
      {isVideoFile ? (
        shouldLoadVideo ? (
          <video
            key={fullSrc}
            autoPlay
            loop
            muted
            playsInline
            poster={placeholderSrc}
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isLoaded && !showPlaceholder ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 0 }}
            onCanPlay={() => revealLoadedMedia(300)}
            onError={() => {
              console.warn('Video failed to load, keeping placeholder')
            }}
          >
            <source src={fullSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null
      ) : (
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
            isLoaded && !showPlaceholder ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${fullSrc})` }}
        />
      )}
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10 pointer-events-none`}></div>
      
      {children}
    </div>
  )
}

export default BlurUpBackground
