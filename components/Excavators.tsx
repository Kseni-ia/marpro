'use client'

import React, { useState } from 'react'
import OrderForm from './OrderForm'
import Image from 'next/image'

type ExcavatorCardProps = {
  model: string
  type: string
  description: string
  price: string
  svgPath: string
  specs: {
    weight: string
    bucketCapacity: string
    maxReach: string
  }
  onOrder: () => void
}

const ExcavatorCard: React.FC<ExcavatorCardProps> = ({ model, type, description, price, svgPath, specs, onOrder }) => {
  return (
    <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
      <div className="flex items-start justify-between flex-col sm:flex-row gap-3 sm:gap-0">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-dark-text">{model}</span>
          </div>
          <span className="text-gray-dark-textSecondary mt-1 block tracking-wide text-sm sm:text-base">{type}</span>
        </div>
        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-dark-card/80 border border-gray-dark-border text-xs sm:text-sm text-gray-dark-textSecondary shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <span className="relative inline-block w-8 sm:w-10 h-4 sm:h-5 rounded-full bg-gray-dark-border">
              <span className="absolute top-0.5 left-0.5 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-dark-card border border-gray-dark-border shadow-sm"></span>
            </span>
            <span className="whitespace-nowrap">Available</span>
          </div>
          <div className="text-gray-dark-textSecondary text-xs sm:text-sm mt-2">{specs.weight}</div>
        </div>
      </div>
      <div className="my-4 sm:my-6 flex justify-center">
        <Image 
          src={svgPath} 
          alt={`${model} excavator`} 
          width={300} 
          height={200} 
          className="w-full h-[120px] sm:h-[160px] md:h-[200px] object-contain"
        />
      </div>
      <div className="h-px w-full bg-gray-e8e dark:bg-gray-dark-border my-4"></div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Bucket</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.bucketCapacity}</div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Max Reach</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.maxReach}</div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-dark-textMuted">Weight</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-dark-text">{specs.weight}</div>
        </div>
      </div>
      <p className="text-gray-dark-textSecondary leading-relaxed text-sm sm:text-base">{description}</p>
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-gray-dark-border bg-gray-dark-card text-gray-dark-text font-medium shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-sm sm:text-base">
          {price}
        </div>
      </div>
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button 
          onClick={onOrder}
          className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base"
        >
          Order excavator
        </button>
        <button className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-dark-card border-2 border-gray-dark-border text-gray-dark-textSecondary hover:border-gray-dark-border transition-all text-sm sm:text-base">
          Details
        </button>
      </div>
    </div>
  )
}

const Excavators: React.FC = () => {
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
          <source src="/exscavators F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content readability */}
        <div className="absolute inset-0 bg-black/80 z-10 pointer-events-none"></div>
      </div>
      
      <div className="relative min-h-screen z-10">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 md:pb-5 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
        Excavators
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-dark-textSecondary text-center max-w-[760px] mx-auto mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-4">
        Professional excavators for all your construction and earthmoving needs. High-quality equipment with experienced operators available.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <ExcavatorCard
          model="TB145"
          type="Mini Excavator"
          description="Compact and versatile mini excavator perfect for tight spaces, landscaping, and small construction projects."
          price="Price from 2 500 CZK/day excl. VAT"
          svgPath="/TB145.svg"
          specs={{
            weight: "1.5t",
            bucketCapacity: "0.04m³",
            maxReach: "3.8m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB290-1"
          type="Compact Excavator"
          description="Mid-size excavator ideal for medium construction projects, utility work, and general excavation tasks."
          price="Price from 4 200 CZK/day excl. VAT"
          svgPath="/TB290-1.svg"
          specs={{
            weight: "2.9t",
            bucketCapacity: "0.09m³",
            maxReach: "5.2m"
          }}
          onOrder={handleOrder}
        />
        <ExcavatorCard
          model="TB290-2"
          type="Heavy Excavator"
          description="Powerful excavator for large-scale construction, demolition, and heavy earthmoving operations."
          price="Price from 4 800 CZK/day excl. VAT"
          svgPath="/TB290-2.svg.svg"
          specs={{
            weight: "2.9t",
            bucketCapacity: "0.11m³",
            maxReach: "5.5m"
          }}
          onOrder={handleOrder}
        />
      </div>
      
      {showOrderForm && (
        <OrderForm
          serviceType="excavators"
          onClose={() => setShowOrderForm(false)}
        />
      )}
      </div>
      </div>
    </>
  )
}

export default Excavators
