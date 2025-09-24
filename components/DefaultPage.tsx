'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Containers from '@/components/Containers'
import Excavators from '@/components/Excavators'
import Constructions from '@/components/Constructions'
import AnimatedLogo from '@/components/AnimatedLogo'

type Section = 'home' | 'containers' | 'excavators' | 'constructions'

const DefaultPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('home')

  const renderSection = () => {
    switch (activeSection) {
      case 'containers':
        return <Containers />
      case 'excavators':
        return <Excavators />
      case 'constructions':
        return <Constructions />
      default:
        return (
          <div className="relative">
            {/* Video Background for home section only */}
            <video 
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{ zIndex: -2 }}
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/F4.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay for better text visibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40" style={{ zIndex: -1 }}></div>
            
            <div className="text-center py-6 sm:py-8 md:py-10 px-4 sm:px-5 relative z-0">
              <div className="mb-8 md:mb-12">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider">
                  MARPRO
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12">
                  Select a section to explore our services
                </p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-12 md:mt-16 max-w-6xl mx-auto">
              <div 
                className="bg-gray-800/50 border-2 border-gray-600 rounded-[20px] p-8 sm:p-10 md:p-12 cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-500 hover:scale-105 backdrop-blur-sm"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl mb-4 font-bold uppercase tracking-wider">
                  CONTAINERS
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  Explore our container solutions
                </p>
              </div>
              
              <div 
                className="bg-gray-800/50 border-2 border-gray-600 rounded-[20px] p-8 sm:p-10 md:p-12 cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-500 hover:scale-105 backdrop-blur-sm"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl mb-4 font-bold uppercase tracking-wider">
                  EXCAVATORS
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  Discover our excavator services
                </p>
              </div>
              
              <div 
                className="bg-gray-800/50 border-2 border-gray-600 rounded-[20px] p-8 sm:p-10 md:p-12 cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-500 hover:scale-105 backdrop-blur-sm"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl mb-4 font-bold uppercase tracking-wider">
                  CONSTRUCTIONS
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  View our construction projects
                </p>
              </div>
            </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
      {/* Navigation Header */}
      <div className="relative px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Image 
            src="/logo.svg" 
            alt="MARPRO" 
            width={120}
            height={40}
            className="h-[40px] w-auto cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setActiveSection('home')}
          />
          
          {/* Navigation Buttons */}
          <nav className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md rounded-full p-2 shadow-lg">
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                activeSection === 'containers' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveSection('containers')}
            >
              Containers
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                activeSection === 'excavators' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveSection('excavators')}
            >
              Excavators
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                activeSection === 'constructions' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveSection('constructions')}
            >
              Constructions
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12 max-w-7xl mx-auto">
        {renderSection()}
      </main>
    </div>
  )
}

export default DefaultPage