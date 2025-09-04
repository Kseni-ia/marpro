import React, { useEffect, useState } from 'react';
import './AnimatedLogo.css';

const AnimatedLogo: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on mount
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3700); // Increased to match the total animation duration
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10);
  };

  return (
    <div className="animated-logo-container">
      <button 
        className="replay-button" 
        onClick={handleReplay}
        disabled={isAnimating}
        aria-label="Replay animation"
      >
        <svg 
          className={`logo ${isAnimating ? 'logo--running' : ''}`}
          viewBox="0 0 400 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="logo__group">
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--M-shadow" 
              d="M 15 60 L 15 15 L 35 45 L 55 15 L 55 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--M" 
              d="M 15 60 L 15 15 L 35 45 L 55 15 L 55 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--A1-shadow" 
              d="M 75 60 L 95 15 L 115 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--shadow logo__letter--A2-shadow" 
              d="M 83 45 L 107 45"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--A1" 
              d="M 75 60 L 95 15 L 115 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--A2" 
              d="M 83 45 L 107 45"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--R1-shadow" 
              d="M 135 60 L 135 15 L 160 15 Q 175 15 175 27.5 T 160 40 L 135 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--shadow logo__letter--R2-shadow" 
              d="M 155 40 L 175 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--R1" 
              d="M 135 60 L 135 15 L 160 15 Q 175 15 175 27.5 T 160 40 L 135 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--R2" 
              d="M 155 40 L 175 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-anim="last"
            />
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--P1-shadow" 
              d="M 195 60 L 195 15 L 220 15 Q 235 15 235 27.5 T 220 40 L 195 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--P1" 
              d="M 195 60 L 195 15 L 220 15 Q 235 15 235 27.5 T 220 40 L 195 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--R3-shadow" 
              d="M 255 60 L 255 15 L 280 15 Q 295 15 295 27.5 T 280 40 L 255 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--shadow logo__letter--R4-shadow" 
              d="M 275 40 L 295 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--R3" 
              d="M 255 60 L 255 15 L 280 15 Q 295 15 295 27.5 T 280 40 L 255 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              className="logo__letter logo__letter--R4" 
              d="M 275 40 L 295 60"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Red shadow layer */}
            <path 
              className="logo__letter logo__letter--shadow logo__letter--O-shadow" 
              d="M 315 37.5 Q 315 15 335 15 T 355 37.5 Q 355 60 335 60 T 315 37.5"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Black main layer */}
            <path 
              className="logo__letter logo__letter--O" 
              d="M 315 37.5 Q 315 15 335 15 T 355 37.5 Q 355 60 335 60 T 315 37.5"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default AnimatedLogo;
