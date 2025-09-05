'use client'

import React from 'react'
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
}

const ExcavatorCard: React.FC<ExcavatorCardProps> = ({ model, type, description, price, svgPath, specs }) => {
  return (
    <div className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-4xl md:text-5xl font-extrabold text-gray-333">{model}</span>
          </div>
          <span className="text-gray-666 mt-1 block tracking-wide">{type}</span>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-e0e text-sm text-gray-666 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <span className="relative inline-block w-10 h-5 rounded-full bg-gray-eee">
              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white border border-gray-e0e shadow-sm"></span>
            </span>
            <span className="whitespace-nowrap">Available</span>
          </div>
          <div className="text-gray-555 text-sm mt-2">{specs.weight}</div>
        </div>
      </div>
      <div className="my-6 flex justify-center">
        <Image 
          src={svgPath} 
          alt={`${model} excavator`} 
          width={300} 
          height={200} 
          className="w-full h-[200px] object-contain"
        />
      </div>
      <div className="h-px w-full bg-gray-e8e my-4"></div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-555">Bucket</div>
          <div className="text-lg font-semibold text-gray-333">{specs.bucketCapacity}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-555">Max Reach</div>
          <div className="text-lg font-semibold text-gray-333">{specs.maxReach}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-555">Weight</div>
          <div className="text-lg font-semibold text-gray-333">{specs.weight}</div>
        </div>
      </div>
      <p className="text-gray-666 leading-relaxed">{description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="px-4 py-2 rounded-xl border-2 border-gray-e0e bg-white text-gray-333 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {price}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <button className="rounded-[14px] px-5 py-3 bg-gradient-button text-gray-333 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all">
          Rent excavator
        </button>
        <button className="rounded-[14px] px-5 py-3 bg-white border-2 border-gray-e0e text-gray-666 hover:border-gray-ccc transition-all">
          Details
        </button>
      </div>
    </div>
  )
}

const Excavators: React.FC = () => {
  return (
    <div className="p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-6xl text-gray-333 text-center mb-12 pb-7 relative uppercase tracking-[3px] font-extrabold shadow-text">
        Excavators
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-999 to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-666 text-center max-w-[760px] mx-auto mb-10">
        Professional excavators for all your construction and earthmoving needs. High-quality equipment with experienced operators available.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
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
        />
      </div>
    </div>
  )
}

export default Excavators
