'use client'

import React, { useState, useEffect } from 'react'

interface BlurUpBackgroundProps {
  placeholderSrc: string
  fullSrc: string
  children?: React.ReactNode
  overlayOpacity?: string
  className?: string
  isVideo?: boolean
}

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
  
  // Auto-detect if source is a video file
  const isVideoFile = isVideo !== undefined ? isVideo : fullSrc.match(/\.(mp4|webm|ogg|mov)$/i) !== null

  useEffect(() => {
    if (isVideoFile) {
      // For videos, preload the video and wait for it to be ready
      const video = document.createElement('video')
      video.src = fullSrc
      video.muted = true
      
      const handleCanPlay = () => {
        setIsLoaded(true)
        // Wait a bit more then fade out placeholder
        setTimeout(() => {
          setShowPlaceholder(false)
        }, 300)
      }
      
      const handleError = () => {
        console.warn('Video failed to load, keeping placeholder')
        // Keep placeholder visible if video fails
      }
      
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      
      // Fallback timer in case video takes too long
      const fallbackTimer = setTimeout(() => {
        if (!isLoaded) {
          console.warn('Video taking too long, keeping placeholder')
        }
      }, 5000)
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
        clearTimeout(fallbackTimer)
      }
    } else {
      // For images, preload the full image
      const img = new Image()
      img.src = fullSrc
      
      img.onload = () => {
        setIsLoaded(true)
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setShowPlaceholder(false)
        }, 100)
      }

      img.onerror = () => {
        // If full image fails to load, keep placeholder
        console.warn('Failed to load full background image:', fullSrc)
      }

      return () => {
        img.onload = null
        img.onerror = null
      }
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded && !showPlaceholder ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 0 }}
        >
          <source src={fullSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
