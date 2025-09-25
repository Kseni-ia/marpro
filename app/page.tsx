'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Containers from '@/components/Containers'
import Excavators from '@/components/Excavators'
import Constructions from '@/components/Constructions'
import AnimatedLogo from '@/components/AnimatedLogo'

type Section = 'home' | 'containers' | 'excavators' | 'constructions'

export default function Home() {
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
          <div className="text-center py-0 px-4 sm:px-5 ml-0 sm:ml-12 md:ml-16">
            <AnimatedLogo />
            <p className="text-base sm:text-lg md:text-xl text-gray-dark-textSecondary mb-4 mt-6 sm:mt-8">Select a section to explore our services</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 md:gap-6 lg:gap-8 justify-items-center max-w-full sm:max-w-5xl mx-auto px-2 sm:px-0">
              <div 
                className="w-full max-w-xs sm:max-w-sm bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-5 sm:p-7 md:p-8 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Containers
                </h3>
                <p className="text-gray-dark-textSecondary text-sm sm:text-base">
                  Explore our container solutions
                </p>
              </div>
              
              <div 
                className="w-full max-w-xs sm:max-w-sm bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-5 sm:p-7 md:p-8 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Excavators
                </h3>
                <p className="text-gray-dark-textSecondary text-sm sm:text-base">
                  Discover our excavator services
                </p>
              </div>
              
              <div 
                className="w-full max-w-xs sm:max-w-sm bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-5 sm:p-7 md:p-8 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Constructions
                </h3>
                <p className="text-gray-dark-textSecondary text-sm sm:text-base">
                  View our construction projects
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container - Independent positioning */}
      <div className="absolute top-0 left-0 sm:-top-14 sm:-left-12 z-30">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={250}
          height={200}
          className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[250px] w-auto cursor-pointer transition-all duration-300"
          onClick={() => setActiveSection('home')}
        />
      </div>
      
      {activeSection === 'home' && (
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/F4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
        </div>
      )}
      <div className="relative min-h-screen z-10 ">
        <div className="relative px-4 sm:px-5 pt-24 sm:pt-20 md:pt-28 pb-4 sm:pb-3">
        <div className="flex items-center justify-center">
          <nav className="flex justify-center items-center gap-1 bg-gray-dark-card/90 backdrop-blur-[10px] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] p-1.5 sm:p-1.5 md:p-2 shadow-[0_2px_15px_rgba(0,0,0,0.3)] z-20">
            <button 
              className={`bg-transparent text-gray-dark-textSecondary border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text ${
                activeSection === 'containers' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
              }`}
              onClick={() => setActiveSection('containers')}
            >
              Containers
            </button>
            <button 
              className={`bg-transparent text-gray-dark-textSecondary border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text ${
                activeSection === 'excavators' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
              }`}
              onClick={() => setActiveSection('excavators')}
            >
              Excavators
            </button>
            <button 
              className={`bg-transparent text-gray-dark-textSecondary border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 dark:hover:bg-gray-dark-border/80 hover:text-gray-dark-text ${
                activeSection === 'constructions' ? 'bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''
              }`}
              onClick={() => setActiveSection('constructions')}
            >
              Constructions
            </button>
          </nav>
        </div>
        </div>
        <main className="px-4 sm:px-5 pt-4 sm:pt-10 md:pt-12 pb-20 sm:pb-10 max-w-[1200px] mx-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
