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
          <div className="text-center py-10 px-5">
            <AnimatedLogo />
            <p className="text-xl text-gray-666 mb-10">Select a section to explore our services</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('containers')}
              >
                <h3 className="text-gray-333 text-3xl mb-4 font-bold uppercase tracking-[2px]">
                  Containers
                </h3>
                <p className="text-gray-666 text-base">
                  Explore our container solutions
                </p>
              </div>
              
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('excavators')}
              >
                <h3 className="text-gray-333 text-3xl mb-4 font-bold uppercase tracking-[2px]">
                  Excavators
                </h3>
                <p className="text-gray-666 text-base">
                  Discover our excavator services
                </p>
              </div>
              
              <div 
                className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-9 cursor-pointer transition-all duration-[400ms] shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine"
                onClick={() => setActiveSection('constructions')}
              >
                <h3 className="text-gray-333 text-3xl mb-4 font-bold uppercase tracking-[2px]">
                  Constructions
                </h3>
                <p className="text-gray-666 text-base">
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
      <div className="relative px-5 md:px-10 py-5">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={60}
          height={60}
          className="absolute left-10 top-5 h-[60px] w-auto cursor-pointer transition-all duration-300 z-10 hover:scale-105 hover:rotate-1"
          onClick={() => setActiveSection('home')}
        />
        <nav className="flex justify-center items-center gap-0 bg-white/90 backdrop-blur-[10px] rounded-[50px] p-2 shadow-[0_2px_15px_rgba(0,0,0,0.08)] max-w-fit mx-auto">
          <button 
            className={`bg-transparent text-gray-666 border-none px-6 py-2.5 text-base cursor-pointer transition-all duration-300 rounded-[40px] font-medium capitalize tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'containers' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('containers')}
          >
            Containers
          </button>
          <button 
            className={`bg-transparent text-gray-666 border-none px-6 py-2.5 text-base cursor-pointer transition-all duration-300 rounded-[40px] font-medium capitalize tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'excavators' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('excavators')}
          >
            Excavators
          </button>
          <button 
            className={`bg-transparent text-gray-666 border-none px-6 py-2.5 text-base cursor-pointer transition-all duration-300 rounded-[40px] font-medium capitalize tracking-[0.3px] relative hover:bg-gray-f0f/80 hover:text-gray-333 ${
              activeSection === 'constructions' ? 'bg-gradient-button text-gray-333 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
            }`}
            onClick={() => setActiveSection('constructions')}
          >
            Constructions
          </button>
        </nav>
      </div>
      <main className="px-5 pt-5 pb-10 max-w-[1200px] mx-auto">
        {renderSection()}
      </main>
    </div>
  )
}
