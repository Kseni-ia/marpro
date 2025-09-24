'use client'

import React, { useState } from 'react'
import OrderForm from './OrderForm'

type ContainerCardProps = {
  volume: number
  dims: string
  description: string
  price: string
  onOrder: () => void
}

const ContainerCard: React.FC<ContainerCardProps> = ({ volume, dims, description, price, onOrder }) => {
  return (
    <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2 pointer-events-none"></div>
      <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0 relative z-10">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-dark-text">{volume}</span>
            <span className="text-xl sm:text-2xl md:text-3xl text-gray-dark-textSecondary">m</span>
            <sup className="text-base sm:text-lg md:text-xl -translate-y-1 inline-block text-gray-dark-textSecondary">3</sup>
          </div>
          <span className="text-gray-dark-textSecondary mt-1 block tracking-wide text-sm sm:text-base">container</span>
        </div>
        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-dark-card/80 border border-gray-dark-border text-xs sm:text-sm text-gray-dark-textSecondary shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <span className="relative inline-block w-8 sm:w-10 h-4 sm:h-5 rounded-full bg-gray-dark-border">
              <span className="absolute top-0.5 left-0.5 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-dark-card border border-gray-dark-border shadow-sm"></span>
            </span>
            <span className="whitespace-nowrap">Narrow variant</span>
          </div>
          <div className="text-gray-dark-textSecondary text-xs sm:text-sm mt-2">{dims}</div>
        </div>
      </div>
      <div className="my-4 sm:my-6 relative z-10">
        <svg viewBox="0 0 360 120" className="w-full h-[80px] sm:h-[100px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Container truck illustration">
          <rect x="150" y="50" width="160" height="30" rx="4" fill="#e8e8e8" stroke="#cccccc"/>
          <rect x="70" y="60" width="70" height="25" rx="4" fill="#666666"/>
          <rect x="70" y="55" width="25" height="15" rx="2" fill="#555555"/>
          <rect x="130" y="75" width="180" height="5" fill="#cccccc"/>
          <circle cx="120" cy="95" r="12" fill="#444444"/>
          <circle cx="120" cy="95" r="6" fill="#eeeeee"/>
          <circle cx="280" cy="95" r="12" fill="#444444"/>
          <circle cx="280" cy="95" r="6" fill="#eeeeee"/>
        </svg>
      </div>
      <div className="h-px w-full bg-gray-e8e dark:bg-gray-dark-border my-4"></div>
      <p className="text-gray-dark-textSecondary leading-relaxed text-sm sm:text-base relative z-10">{description}</p>
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-gray-dark-border bg-gray-dark-card text-gray-dark-text font-medium shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-sm sm:text-base">
          {price}
        </div>
      </div>
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
        <button 
          onClick={onOrder}
          className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base cursor-pointer"
          type="button"
        >
          Order container
        </button>
        <button className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-dark-card border-2 border-gray-dark-border text-gray-dark-textSecondary hover:border-gray-dark-border transition-all text-sm sm:text-base">
          Details
        </button>
      </div>
    </div>
  )
}

const Containers: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)

  const handleOrder = () => {
    setShowOrderForm(true)
  }

  return (
    <>
      {/* Full Screen Video Background - Outside all containers */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/containers_F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content readability */}
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
      </div>
      
      <div className="relative min-h-screen z-10">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-6 sm:mb-8 md:mb-12 pb-4 sm:pb-5 md:pb-7 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
        Containers
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-dark-textSecondary text-center max-w-[760px] mx-auto mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base px-4">
        Choose from our most popular container sizes. Designed to match your project needs and delivered quickly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-4">
        <ContainerCard
          volume={3}
          dims="2 x 0.5 x 3.8 m"
          description="Compact container suitable for light waste, wood, small rubble, soil and similar materials."
          price="Price from 3 090 CZK excl. VAT"
          onOrder={handleOrder}
        />
        <ContainerCard
          volume={5}
          dims="2 x 0.7 x 3.8 m"
          description="Spacious option for larger loads of light waste, wood, rubble and mixed materials."
          price="Price from 3 150 CZK excl. VAT"
          onOrder={handleOrder}
        />
      </div>
      
      {showOrderForm && (
        <OrderForm
          serviceType="containers"
          onClose={() => setShowOrderForm(false)}
        />
      )}
      </div>
      </div>
    </>
  )
}

export default Containers

