'use client'

import React, { useEffect, useState } from 'react'

const AnimatedLogo: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 3700)
    return () => clearTimeout(timer)
  }, [])

  const handleReplay = () => {
    setIsAnimating(false)
    setTimeout(() => setIsAnimating(true), 10)
  }

  return (
    <div className="flex justify-center items-center py-2">
      <button 
        className={`bg-transparent border-0 cursor-pointer transition-transform duration-300 hover:scale-105 disabled:cursor-default ${
          isAnimating ? '' : 'hover:scale-105'
        }`}
        onClick={handleReplay}
        disabled={isAnimating}
        aria-label="Replay animation"
      >
        <svg 
          className={`w-[40rem] h-[8rem] max-w-[90vw] md:w-[32rem] md:h-[6.4rem] sm:w-[24rem] sm:h-[4.8rem] ${
            isAnimating ? 'logo-running' : ''
          }`}
          viewBox="0 0 400 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .logo-letter {
              stroke: #ffffff;
              fill: none;
              stroke-width: 6;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            
            .logo-letter-shadow {
              stroke: #dc2626;
              opacity: 0.5;
            }
            
            /* Stroke dash arrays */
            .letter-M { stroke-dasharray: 180 180; }
            .letter-A1 { stroke-dasharray: 120 120; }
            .letter-A2 { stroke-dasharray: 30 30; }
            .letter-R1 { stroke-dasharray: 150 150; }
            .letter-R2 { stroke-dasharray: 40 40; }
            .letter-P1 { stroke-dasharray: 120 120; }
            .letter-R3 { stroke-dasharray: 150 150; }
            .letter-R4 { stroke-dasharray: 40 40; }
            .letter-O { stroke-dasharray: 140 140; }
            
            /* Animations for black letters */
            .logo-running .letter-M {
              animation: drawM 2.5s cubic-bezier(0.5, 0, 0.5, 1) forwards;
              stroke-dashoffset: 180;
            }
            
            .logo-running .letter-A1 {
              animation: drawA1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.15s forwards;
              stroke-dashoffset: 120;
            }
            
            .logo-running .letter-A2 {
              animation: drawA2 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.3s forwards;
              stroke-dashoffset: 30;
            }
            
            .logo-running .letter-R1 {
              animation: drawR1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.45s forwards;
              stroke-dashoffset: 150;
            }
            
            .logo-running .letter-R2 {
              animation: drawR2 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.6s forwards;
              stroke-dashoffset: 40;
            }
            
            .logo-running .letter-P1 {
              animation: drawP1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.75s forwards;
              stroke-dashoffset: 120;
            }
            
            .logo-running .letter-R3 {
              animation: drawR3 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.9s forwards;
              stroke-dashoffset: 150;
            }
            
            .logo-running .letter-R4 {
              animation: drawR4 2.5s cubic-bezier(0.5, 0, 0.5, 1) 1.05s forwards;
              stroke-dashoffset: 40;
            }
            
            .logo-running .letter-O {
              animation: drawO 2.5s cubic-bezier(0.5, 0, 0.5, 1) 1.2s forwards;
              stroke-dashoffset: 140;
            }
            
            /* Animations for shadow letters */
            .logo-running .letter-M-shadow {
              animation: drawM 2s cubic-bezier(0.5, 0, 0.5, 1) forwards;
              stroke-dashoffset: 180;
            }
            
            .logo-running .letter-A1-shadow {
              animation: drawA1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.1s forwards;
              stroke-dashoffset: 120;
            }
            
            .logo-running .letter-A2-shadow {
              animation: drawA2 2s cubic-bezier(0.5, 0, 0.5, 1) 0.2s forwards;
              stroke-dashoffset: 30;
            }
            
            .logo-running .letter-R1-shadow {
              animation: drawR1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.3s forwards;
              stroke-dashoffset: 150;
            }
            
            .logo-running .letter-R2-shadow {
              animation: drawR2 2s cubic-bezier(0.5, 0, 0.5, 1) 0.4s forwards;
              stroke-dashoffset: 40;
            }
            
            .logo-running .letter-P1-shadow {
              animation: drawP1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.5s forwards;
              stroke-dashoffset: 120;
            }
            
            .logo-running .letter-R3-shadow {
              animation: drawR3 2s cubic-bezier(0.5, 0, 0.5, 1) 0.6s forwards;
              stroke-dashoffset: 150;
            }
            
            .logo-running .letter-R4-shadow {
              animation: drawR4 2s cubic-bezier(0.5, 0, 0.5, 1) 0.7s forwards;
              stroke-dashoffset: 40;
            }
            
            .logo-running .letter-O-shadow {
              animation: drawO 2s cubic-bezier(0.5, 0, 0.5, 1) 0.8s forwards;
              stroke-dashoffset: 140;
            }
            
            /* Keyframes */
            @keyframes drawM {
              from { stroke-dashoffset: 180; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawA1 {
              from { stroke-dashoffset: 120; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawA2 {
              from { stroke-dashoffset: 30; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawR1 {
              from { stroke-dashoffset: 150; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawR2 {
              from { stroke-dashoffset: 40; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawP1 {
              from { stroke-dashoffset: 120; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawR3 {
              from { stroke-dashoffset: 150; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawR4 {
              from { stroke-dashoffset: 40; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            @keyframes drawO {
              from { stroke-dashoffset: 140; opacity: 0; }
              10% { opacity: 1; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            
            /* Hover effect */
            button:not(:disabled):hover .logo-letter {
              stroke: #e0e0e0;
              transition: stroke 0.3s ease;
            }
          `}</style>
          <g className="logo-group">
            {/* Red shadow layer */}
            <path 
              className="logo-letter logo-letter-shadow letter-M letter-M-shadow" 
              d="M 15 60 L 15 15 L 35 45 L 55 15 L 55 60"
            />
            {/* Black main layer */}
            <path 
              className="logo-letter letter-M" 
              d="M 15 60 L 15 15 L 35 45 L 55 15 L 55 60"
            />
            {/* Red shadow layer A */}
            <path 
              className="logo-letter logo-letter-shadow letter-A1 letter-A1-shadow" 
              d="M 75 60 L 95 15 L 115 60"
            />
            <path 
              className="logo-letter logo-letter-shadow letter-A2 letter-A2-shadow" 
              d="M 83 45 L 107 45"
            />
            {/* Black main layer A */}
            <path 
              className="logo-letter letter-A1" 
              d="M 75 60 L 95 15 L 115 60"
            />
            <path 
              className="logo-letter letter-A2" 
              d="M 83 45 L 107 45"
            />
            {/* Red shadow layer R1 */}
            <path 
              className="logo-letter logo-letter-shadow letter-R1 letter-R1-shadow" 
              d="M 135 60 L 135 15 L 160 15 Q 175 15 175 27.5 T 160 40 L 135 40"
            />
            <path 
              className="logo-letter logo-letter-shadow letter-R2 letter-R2-shadow" 
              d="M 155 40 L 175 60"
            />
            {/* Black main layer R1 */}
            <path 
              className="logo-letter letter-R1" 
              d="M 135 60 L 135 15 L 160 15 Q 175 15 175 27.5 T 160 40 L 135 40"
            />
            <path 
              className="logo-letter letter-R2" 
              d="M 155 40 L 175 60"
            />
            {/* Red shadow layer P */}
            <path 
              className="logo-letter logo-letter-shadow letter-P1 letter-P1-shadow" 
              d="M 195 60 L 195 15 L 220 15 Q 235 15 235 27.5 T 220 40 L 195 40"
            />
            {/* Black main layer P */}
            <path 
              className="logo-letter letter-P1" 
              d="M 195 60 L 195 15 L 220 15 Q 235 15 235 27.5 T 220 40 L 195 40"
            />
            {/* Red shadow layer R2 */}
            <path 
              className="logo-letter logo-letter-shadow letter-R3 letter-R3-shadow" 
              d="M 255 60 L 255 15 L 280 15 Q 295 15 295 27.5 T 280 40 L 255 40"
            />
            <path 
              className="logo-letter logo-letter-shadow letter-R4 letter-R4-shadow" 
              d="M 275 40 L 295 60"
            />
            {/* Black main layer R2 */}
            <path 
              className="logo-letter letter-R3" 
              d="M 255 60 L 255 15 L 280 15 Q 295 15 295 27.5 T 280 40 L 255 40"
            />
            <path 
              className="logo-letter letter-R4" 
              d="M 275 40 L 295 60"
            />
            {/* Red shadow layer O */}
            <path 
              className="logo-letter logo-letter-shadow letter-O letter-O-shadow" 
              d="M 315 37.5 Q 315 15 335 15 T 355 37.5 Q 355 60 335 60 T 315 37.5"
            />
            {/* Black main layer O */}
            <path 
              className="logo-letter letter-O" 
              d="M 315 37.5 Q 315 15 335 15 T 355 37.5 Q 355 60 335 60 T 315 37.5"
            />
          </g>
        </svg>
      </button>
    </div>
  )
}

export default AnimatedLogo
