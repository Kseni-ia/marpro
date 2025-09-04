import React, { useEffect, useRef } from 'react';
import './AnimatedText.css';

const AnimatedText: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Add animation trigger on mount
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.classList.add('animate');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button ref={buttonRef} id="logo" type="button" className="animated-text-button">
      <svg 
        className="logo" 
        fill="none" 
        stroke="#333333" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        width="280px" 
        height="60px" 
        viewBox="0 0 280 60" 
        role="img" 
        aria-label="MARPRO"
      >
        {/* Shadow layer 1 */}
        <g className="logo__group" opacity="0.1">
          <path className="logo__letter logo__letter--M" d="M10,45 L10,15 L25,40 L40,15 L40,45"/>
          <path className="logo__letter logo__letter--A" d="M55,45 L65,15 L75,45 M58,35 L72,35"/>
          <path className="logo__letter logo__letter--R" d="M90,45 L90,15 L105,15 Q115,15 115,25 Q115,35 105,35 L90,35 M100,35 L115,45"/>
          <path className="logo__letter logo__letter--P" d="M130,45 L130,15 L145,15 Q155,15 155,25 Q155,35 145,35 L130,35"/>
          <path className="logo__letter logo__letter--R2" d="M170,45 L170,15 L185,15 Q195,15 195,25 Q195,35 185,35 L170,35 M180,35 L195,45"/>
          <circle className="logo__letter logo__letter--O" cx="220" cy="30" r="15"/>
        </g>
        {/* Shadow layer 2 */}
        <g className="logo__group" opacity="0.15">
          <path className="logo__letter logo__letter--M" d="M10,45 L10,15 L25,40 L40,15 L40,45"/>
          <path className="logo__letter logo__letter--A" d="M55,45 L65,15 L75,45 M58,35 L72,35"/>
          <path className="logo__letter logo__letter--R" d="M90,45 L90,15 L105,15 Q115,15 115,25 Q115,35 105,35 L90,35 M100,35 L115,45"/>
          <path className="logo__letter logo__letter--P" d="M130,45 L130,15 L145,15 Q155,15 155,25 Q155,35 145,35 L130,35"/>
          <path className="logo__letter logo__letter--R2" d="M170,45 L170,15 L185,15 Q195,15 195,25 Q195,35 185,35 L170,35 M180,35 L195,45"/>
          <circle className="logo__letter logo__letter--O" cx="220" cy="30" r="15"/>
        </g>
        {/* Main animated layer */}
        <g className="logo__group logo__group--main">
          <path className="logo__letter logo__letter--M" d="M10,45 L10,15 L25,40 L40,15 L40,45"/>
          <path className="logo__letter logo__letter--A" d="M55,45 L65,15 L75,45 M58,35 L72,35"/>
          <path className="logo__letter logo__letter--R" d="M90,45 L90,15 L105,15 Q115,15 115,25 Q115,35 105,35 L90,35 M100,35 L115,45"/>
          <path className="logo__letter logo__letter--P" d="M130,45 L130,15 L145,15 Q155,15 155,25 Q155,35 145,35 L130,35"/>
          <path className="logo__letter logo__letter--R2" d="M170,45 L170,15 L185,15 Q195,15 195,25 Q195,35 185,35 L170,35 M180,35 L195,45"/>
          <circle className="logo__letter logo__letter--O" cx="220" cy="30" r="15"/>
        </g>
      </svg>
    </button>
  );
};

export default AnimatedText;
