'use client'

import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-16 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Email */}
          <div className="flex items-center gap-3 text-gray-dark-text hover:text-red-400 transition-colors duration-300">
            <span className="text-red-500 text-lg">✉</span>
            <a 
              href="mailto:marprostav@outlook.cz" 
              className="text-sm sm:text-base font-medium tracking-wide hover:underline"
            >
              marprostav@outlook.cz
            </a>
          </div>
          
          {/* Phone */}
          <div className="flex items-center gap-3 text-gray-dark-text hover:text-red-400 transition-colors duration-300">
            <span className="text-red-500 text-lg">📞</span>
            <a 
              href="tel:+420607428667" 
              className="text-sm sm:text-base font-medium tracking-wide hover:underline"
            >
              +420 607 428 667
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        
      </div>
    </footer>
  )
}
