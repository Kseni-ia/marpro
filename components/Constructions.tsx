'use client'

import React, { useState } from 'react'
import OrderForm from './OrderForm'

const Constructions: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false)

  return (
    <>
      {/* Full Screen Video Background - Outside all containers */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="/constructions F.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure content readability */}
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
      </div>
      
      <div className="relative min-h-screen z-10">
      
      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-6 md:p-10 animate-fade-in min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-dark-text text-center mb-6 sm:mb-8 md:mb-12 pb-4 sm:pb-5 md:pb-7 relative uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-extrabold shadow-text">
          Constructions
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60px] sm:w-[80px] md:w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width"></span>
        </h1>
      
      <div className="bg-gradient-maintenance-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] md:rounded-[25px] p-6 sm:p-8 md:p-12 text-center mb-8 sm:mb-10 md:mb-15 shadow-[0_15px_40px_rgba(0,0,0,0.3)] relative overflow-hidden rotating-bg">
        <button 
          onClick={() => setShowOrderForm(true)}
          className="rounded-[14px] px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-button-dark text-gray-dark-text font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all text-sm sm:text-base"
        >
          Order construction
        </button>
        <p className="text-gray-dark-textSecondary text-base sm:text-lg mb-3 sm:mb-4">
          We're currently updating our construction services information.
        </p>
        <p className="text-gray-dark-textSecondary text-base sm:text-lg mb-3 sm:mb-4">Please check back soon for:</p>
        <ul className="list-none p-0 mt-4 sm:mt-5">
          <li className="text-gray-dark-textMuted py-2 sm:py-3 border-b border-white/10 text-sm sm:text-base md:text-lg transition-all duration-300 relative z-10 hover:text-gray-dark-text hover:pl-2.5 hover:border-white/20">
            Construction project types
          </li>
          <li className="text-gray-dark-textMuted py-2 sm:py-3 border-b border-white/10 text-sm sm:text-base md:text-lg transition-all duration-300 relative z-10 hover:text-gray-dark-text hover:pl-2.5 hover:border-white/20">
            Our portfolio and past projects
          </li>
          <li className="text-gray-dark-textMuted py-2 sm:py-3 border-b border-white/10 text-sm sm:text-base md:text-lg transition-all duration-300 relative z-10 hover:text-gray-dark-text hover:pl-2.5 hover:border-white/20">
            Engineering and design services
          </li>
          <li className="text-gray-dark-textMuted py-2 sm:py-3 text-sm sm:text-base md:text-lg transition-all duration-300 relative z-10 hover:text-gray-dark-text hover:pl-2.5">
            Project management solutions
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10">
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 md:mb-5 pb-2 sm:pb-3 md:pb-4 relative uppercase tracking-wide sm:tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[30px] sm:after:w-[40px] md:after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-dark-textMuted after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Residential Projects
          </h3>
          <p className="text-gray-dark-textSecondary text-sm sm:text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
        
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 md:mb-5 pb-2 sm:pb-3 md:pb-4 relative uppercase tracking-wide sm:tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[30px] sm:after:w-[40px] md:after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-dark-textMuted after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Commercial Projects
          </h3>
          <p className="text-gray-dark-textSecondary text-sm sm:text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
        
        <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[15px] sm:rounded-[20px] p-4 sm:p-5 md:p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark hover:border-gray-dark-border card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover-dark transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-dark-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 md:mb-5 pb-2 sm:pb-3 md:pb-4 relative uppercase tracking-wide sm:tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[30px] sm:after:w-[40px] md:after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-dark-textMuted after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Infrastructure
          </h3>
          <p className="text-gray-dark-textSecondary text-sm sm:text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
      </div>
        
        {showOrderForm && (
          <OrderForm
            serviceType="constructions"
            onClose={() => setShowOrderForm(false)}
          />
        )}
      </div>
      </div>
    </>
  )
}

export default Constructions
