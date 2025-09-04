'use client'

import React from 'react'

const Constructions: React.FC = () => {
  return (
    <div className="p-10 animate-fade-in min-h-[calc(100vh-100px)]">
      <h1 className="text-6xl text-gray-333 text-center mb-12 pb-7 relative uppercase tracking-[3px] font-extrabold shadow-text">
        Constructions
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[100px] h-1 bg-gradient-to-r from-transparent via-gray-999 to-transparent animate-pulse-width"></span>
      </h1>
      
      <div className="bg-gradient-maintenance border-2 border-gray-e0e rounded-[25px] p-12 text-center mb-15 shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden rotating-bg">
        <h2 className="text-gray-333 text-4xl mb-6 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
          🚧 Under Maintenance 🚧
        </h2>
        <p className="text-gray-666 text-lg mb-4">
          We're currently updating our construction services information.
        </p>
        <p className="text-gray-666 text-lg mb-4">Please check back soon for:</p>
        <ul className="list-none p-0 mt-5">
          <li className="text-gray-555 py-3 border-b border-black/5 text-lg transition-all duration-300 relative z-10 hover:text-gray-333 hover:pl-2.5 hover:border-black/10">
            Construction project types
          </li>
          <li className="text-gray-555 py-3 border-b border-black/5 text-lg transition-all duration-300 relative z-10 hover:text-gray-333 hover:pl-2.5 hover:border-black/10">
            Our portfolio and past projects
          </li>
          <li className="text-gray-555 py-3 border-b border-black/5 text-lg transition-all duration-300 relative z-10 hover:text-gray-333 hover:pl-2.5 hover:border-black/10">
            Engineering and design services
          </li>
          <li className="text-gray-555 py-3 text-lg transition-all duration-300 relative z-10 hover:text-gray-333 hover:pl-2.5">
            Project management solutions
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        <div className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-333 text-3xl mb-5 pb-4 relative uppercase tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-999 after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Residential Projects
          </h3>
          <p className="text-gray-666 text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
        
        <div className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-333 text-3xl mb-5 pb-4 relative uppercase tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-999 after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Commercial Projects
          </h3>
          <p className="text-gray-666 text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
        
        <div className="bg-gradient-card border-2 border-gray-e0e rounded-[20px] p-7 transition-all duration-[400ms] shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:bg-gradient-card-hover hover:border-gray-ccc card-shine">
          <div className="absolute -top-full -right-full w-[200%] h-[200%] bg-gradient-radial-hover transition-all duration-500 group-hover:-top-1/2 group-hover:-right-1/2"></div>
          <h3 className="text-gray-333 text-3xl mb-5 pb-4 relative uppercase tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-gray-999 after:to-transparent after:transition-all after:duration-300 group-hover:after:w-full">
            Infrastructure
          </h3>
          <p className="text-gray-666 text-base leading-relaxed">
            Information coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

export default Constructions
