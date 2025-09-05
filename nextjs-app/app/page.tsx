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
          <div className="text-center py-6 sm:py-8 md:py-10 px-4 sm:px-5">
            <AnimatedLogo />
            <p className="text-base sm:text-lg md:text-xl text-gray-666 mb-6 sm:mb-8 md:mb-10">Select a section to explore our services</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[15px] sm:rounded-[20px] p-6 sm:p-7 md:p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-gray-333 text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Containers
                </h3>
                <p className="text-gray-666 text-sm sm:text-base">
                  Explore our container solutions
                </p>
              </div>
              
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[15px] sm:rounded-[20px] p-6 sm:p-7 md:p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-gray-333 text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Excavators
                </h3>
                <p className="text-gray-666 text-sm sm:text-base">
                  Discover our excavator services
                </p>
              </div>
              
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[15px] sm:rounded-[20px] p-6 sm:p-7 md:p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-gray-333 text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-bold uppercase tracking-[1px] sm:tracking-[2px]">
                  Constructions
                </h3>
                <p className="text-gray-666 text-sm sm:text-base">
                  View our construction projects
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main text-red-700 relative">
      <div className="relative px-4 sm:px-5 md:px-10 py-4 sm:py-5">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={60}
          height={60}
          className="absolute left-4 sm:left-6 md:left-10 top-4 sm:top-5 h-[40px] sm:h-[50px] md:h-[60px] w-auto cursor-pointer transition-all duration-300 z-10 hover:scale-105 hover:rotate-1"
          onClick={() => setActiveSection('home')}
        />
        <nav className="flex justify-center items-center gap-0 bg-white/90 backdrop-blur-[10px] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] p-1.5 sm:p-2 shadow-[0_2px_15px_rgba(0,0,0,0.08)] max-w-fit mx-auto mt-12 sm:mt-14 md:mt-16 lg:mt-0 relative z-20">
          <button 
            className={`bg-transparent text-gray-666 border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'containers' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('containers')}
          >
            Containers
          </button>
          <button 
            className={`bg-transparent text-gray-666 border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'excavators' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('excavators')}
          >
            Excavators
          </button>
          <button 
            className={`bg-transparent text-gray-666 border-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 rounded-[25px] sm:rounded-[30px] md:rounded-[40px] font-medium capitalize tracking-[0.2px] sm:tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'constructions' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('constructions')}
          >
            Constructions
          </button>
        </nav>
      </div>
      <main className="px-4 sm:px-5 pt-4 sm:pt-5 pb-8 sm:pb-10 max-w-[1200px] mx-auto">
        {renderSection()}
      </main>
    </div>
  )
}
