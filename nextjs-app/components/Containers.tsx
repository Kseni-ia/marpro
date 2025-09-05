'use client'

import React from 'react'

type ContainerCardProps = {
  volume: number
  dims: string
  description: string
  price: string
}

const ContainerCard: React.FC<ContainerCardProps> = ({ volume, dims, description, price }) => {
  return (
    <div className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine">
      <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-5xl md:text-6xl font-extrabold text-gray-333">{volume}</span>
            <span className="text-2xl md:text-3xl text-gray-555">m</span>
            <sup className="text-lg md:text-xl -translate-y-1 inline-block text-gray-555">3</sup>
          </div>
          <span className="text-gray-666 mt-1 block tracking-wide">container</span>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-e0e text-sm text-gray-666 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <span className="relative inline-block w-10 h-5 rounded-full bg-gray-eee">
              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white border border-gray-e0e shadow-sm"></span>
            </span>
            <span className="whitespace-nowrap">Narrow variant</span>
          </div>
          <div className="text-gray-555 text-sm mt-2">{dims}</div>
        </div>
      </div>
      <div className="my-6">
        <svg viewBox="0 0 360 120" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Container truck illustration">
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
      <div className="h-px w-full bg-gray-e8e my-4"></div>
      <p className="text-gray-666 leading-relaxed">{description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="px-4 py-2 rounded-xl border-2 border-gray-e0e bg-white text-gray-333 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {price}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <button className="rounded-[14px] px-5 py-3 bg-gradient-button text-gray-333 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all">
          Select container
        </button>
        <button className="rounded-[14px] px-5 py-3 bg-white border-2 border-gray-e0e text-gray-666 hover:border-gray-ccc transition-all">
          Details
        </button>
      </div>
    </div>
  )
}

const Containers: React.FC = () => {
  return (
    <div className="p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-6xl text-gray-333 text-center mb-12 pb-7 relative uppercase tracking-[3px] font-extrabold shadow-text">
        Containers
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-999 to-transparent animate-pulse-width"></span>
      </h1>
      <p className="text-gray-666 text-center max-w-[760px] mx-auto mb-10">
        Choose from our most popular container sizes. Designed to match your project needs and delivered quickly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <ContainerCard
          volume={3}
          dims="2 x 0.5 x 3.8 m"
          description="Compact container suitable for light waste, wood, small rubble, soil and similar materials."
          price="Price from 3 090 CZK excl. VAT"
        />
        <ContainerCard
          volume={5}
          dims="2 x 0.7 x 3.8 m"
          description="Spacious option for larger loads of light waste, wood, rubble and mixed materials."
          price="Price from 3 150 CZK excl. VAT"
        />
      </div>
    </div>
  )
}

export default Containers

