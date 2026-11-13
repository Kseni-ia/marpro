'use client'

import React, { useState } from 'react'
import { BrandDefs, BrandEmblem } from './BrandLogo'

/**
 * Homepage hero logo: the MARPRO brand logo with a short entrance animation.
 *
 * Timeline (~2.4s): wrench settles in -> water and heat sweep around it ->
 * drop and flame appear -> MARPRO -> VODA fills like water, TOPENÍ like heat ->
 * service words -> underline. Afterwards only a slow flame flicker and an
 * occasional light sweep over the wordmark remain.
 *
 * Only opacity / transform / stroke-dashoffset are animated (safe on mobile
 * Safari), and everything is disabled under prefers-reduced-motion.
 */

const P = 'hero-'

// Text and badges live inside a skewX(-10) group (italic look). Inside that
// group a point at height y appears shifted left by y * tan(10°) ≈ 0.1763 * y.

const TAGLINE = [
  { dot: 275, x: 285, len: 88, word: 'INSTALACE', color: '#38bdf8' },
  { dot: 387, x: 397, len: 64, word: 'OPRAVY', color: '#f97316' },
  { dot: 475, x: 485, len: 58, word: 'SERVIS', color: '#38bdf8' },
  { dot: 557, x: 567, len: 72, word: 'HAVÁRIE', color: '#f97316' },
]

const BrandLogoAnimated: React.FC = () => {
  const [playKey, setPlayKey] = useState(0)

  return (
    <div className="flex justify-center w-full px-4">
      <button
        type="button"
        className="bg-transparent border-0 cursor-pointer p-0"
        onClick={() => setPlayKey((k) => k + 1)}
        aria-label="MARPRO s.r.o. — voda, topení. Přehrát animaci loga"
      >
        <svg
          key={playKey}
          className="ml w-[92vw] max-w-[660px] h-auto"
          viewBox="0 0 660 290"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="MARPRO s.r.o. — voda, topení"
        >
          <title>MARPRO s.r.o. — voda, topení</title>
          <BrandDefs p={P} />
          <defs>
            <linearGradient id={`${P}chrome`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#f1f5f9" />
              <stop offset="1" stopColor="#b6c0cd" />
            </linearGradient>
            <linearGradient id={`${P}voda`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0369a1" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id={`${P}topeni`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ea580c" />
              <stop offset="1" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id={`${P}sheen`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id={`${P}text-shadow`} x="-5%" y="-10%" width="110%" height="135%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
            </filter>
            <clipPath id={`${P}clip-voda`}>
              <rect x="256" y="172" width="176" height="38" rx="5" />
            </clipPath>
            <clipPath id={`${P}clip-topeni`}>
              <rect x="436" y="172" width="190" height="38" rx="5" />
            </clipPath>
            <mask id={`${P}mask-word`} maskUnits="userSpaceOnUse" x="230" y="70" width="420" height="80">
              <text x="251" y="140" textLength="372" lengthAdjust="spacingAndGlyphs" fontSize="80" fontWeight="900" fill="#ffffff">
                MARPRO
              </text>
            </mask>
          </defs>

          <style>{`
            .ml { overflow: visible; font-family: inherit; }
            .ml text { font-family: inherit; }
            .ml * { animation-fill-mode: both; }

            /* ---------- entrance ---------- */
            .ml-wrench { transform-box: fill-box; transform-origin: 50% 50%; animation: ml-wrench 1s cubic-bezier(.22,1,.36,1) 0s both; }
            @keyframes ml-wrench {
              from { transform: rotate(-28deg) scale(.9); opacity: 0; }
              to   { transform: rotate(0deg) scale(1); opacity: 1; }
            }

            .ml-swoosh { transform-box: fill-box; transform-origin: 50% 50%; }
            .ml-swoosh-blue { animation: ml-sweep-a 1.25s cubic-bezier(.22,1,.36,1) .25s both; }
            .ml-swoosh-orange { animation: ml-sweep-b 1.25s cubic-bezier(.22,1,.36,1) .4s both; }
            @keyframes ml-sweep-a {
              0%   { transform: rotate(150deg); opacity: 0; }
              35%  { opacity: 1; }
              100% { transform: rotate(0deg); opacity: 1; }
            }
            @keyframes ml-sweep-b {
              0%   { transform: rotate(170deg); opacity: 0; }
              35%  { opacity: 1; }
              100% { transform: rotate(0deg); opacity: 1; }
            }

            .ml-drop { transform-box: fill-box; transform-origin: 50% 60%; animation: ml-drop .8s cubic-bezier(.22,1,.36,1) .85s both; }
            @keyframes ml-drop {
              from { transform: translateY(-16px) scale(.7); opacity: 0; }
              to   { transform: translateY(0) scale(1); opacity: 1; }
            }

            .ml-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: ml-flame .9s cubic-bezier(.22,1,.36,1) 1s both; }
            @keyframes ml-flame {
              from { transform: scale(.75, .45); opacity: 0; }
              to   { transform: scale(1, 1); opacity: 1; }
            }

            .ml-draw { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: ml-draw .9s cubic-bezier(.65,0,.35,1) both; }
            @keyframes ml-draw { to { stroke-dashoffset: 0; } }

            .ml-word { animation: ml-word .9s cubic-bezier(.22,1,.36,1) 1.05s both; }
            @keyframes ml-word {
              from { transform: translateX(-22px); opacity: 0; }
              to   { transform: translateX(0); opacity: 1; }
            }

            .ml-fade { animation: ml-fade .5s ease-out both; }
            @keyframes ml-fade { from { opacity: 0; } to { opacity: 1; } }

            .ml-fill-x { animation: ml-fill-x .7s cubic-bezier(.65,0,.35,1) 1.45s both; }
            @keyframes ml-fill-x { from { transform: translateX(-178px); } to { transform: translateX(0); } }
            .ml-fill-y { animation: ml-fill-y .7s cubic-bezier(.65,0,.35,1) 1.6s both; }
            @keyframes ml-fill-y { from { transform: translateY(40px); } to { transform: translateY(0); } }

            .ml-rise { animation: ml-rise .5s cubic-bezier(.22,1,.36,1) both; }
            @keyframes ml-rise { from { transform: translateY(6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            /* ---------- quiet idle ---------- */
            .ml-flame-idle { transform-box: fill-box; transform-origin: 50% 100%; animation: ml-flicker 3.2s ease-in-out 2.6s infinite; }
            @keyframes ml-flicker {
              0%, 100% { transform: scale(1, 1) skewX(0deg); }
              30% { transform: scale(1.01, 1.035) skewX(-1deg); }
              60% { transform: scale(.995, .985) skewX(.8deg); }
            }
            .ml-flame-glow { animation: ml-glow 3.2s ease-in-out 2.6s infinite; }
            @keyframes ml-glow { 0%, 100% { opacity: .4; } 50% { opacity: .55; } }

            .ml-sheen { transform: translateX(-80px); opacity: 0; animation: ml-sheen 7s cubic-bezier(.4,0,.2,1) 2s infinite; }
            @keyframes ml-sheen {
              0%   { transform: translateX(-80px); opacity: 1; }
              16%  { transform: translateX(440px); opacity: 1; }
              17%, 100% { transform: translateX(440px); opacity: 0; }
            }

            @media (prefers-reduced-motion: reduce) {
              .ml * { animation: none !important; }
              .ml-draw { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* frame lines above / right of the wordmark */}
          <path
            className="ml-draw"
            style={{ ['--len' as string]: 202, animationDelay: '1.1s' } as React.CSSProperties}
            d="M252 50 L452 50"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="ml-draw"
            style={{ ['--len' as string]: 292, animationDelay: '1.3s' } as React.CSSProperties}
            d="M464 50 L628 50 Q642 50 642 64 L642 168"
            fill="none"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <BrandEmblem p={P} />

          {/* wordmark, badges, services (italic via skew) */}
          <g transform="translate(20 0) skewX(-10)">
            <g className="ml-word">
              <text
                x="251"
                y="140"
                textLength="372"
                lengthAdjust="spacingAndGlyphs"
                fontSize="80"
                fontWeight="900"
                fill={`url(#${P}chrome)`}
                filter={`url(#${P}text-shadow)`}
              >
                MARPRO
              </text>
              <g mask={`url(#${P}mask-word)`}>
                <rect className="ml-sheen" x="230" y="70" width="70" height="80" fill={`url(#${P}sheen)`} />
              </g>
            </g>
            <text
              className="ml-fade"
              style={{ animationDelay: '1.5s' }}
              x="627"
              y="161"
              textAnchor="end"
              fontSize="15"
              fontWeight="800"
              letterSpacing="2"
              fill="#cbd5e1"
            >
              S.R.O.
            </text>

            {/* VODA — fills from the left like water */}
            <g clipPath={`url(#${P}clip-voda)`}>
              <rect className="ml-fill-x" x="256" y="172" width="176" height="38" fill={`url(#${P}voda)`} />
            </g>
            <g className="ml-fade" style={{ animationDelay: '1.85s' }} fill="#ffffff">
              <text x="272" y="200.5" fontSize="25" fontWeight="900" letterSpacing="1">
                VODA
              </text>
              {/* tap */}
              <rect x="394" y="179" width="14" height="3.5" rx="1.75" />
              <rect x="399.2" y="181" width="3.6" height="6" />
              <path d="M384 187 H409 A8 8 0 0 1 417 195 V200 H410 V196.5 A2.5 2.5 0 0 0 407.5 194 H384 Z" />
              <path d="M413.5 202 C413.5 202 411.4 204.8 411.4 206.2 A2.1 2.1 0 0 0 415.6 206.2 C415.6 204.8 413.5 202 413.5 202 Z" />
            </g>

            {/* TOPENÍ — fills from below like rising heat */}
            <g clipPath={`url(#${P}clip-topeni)`}>
              <rect className="ml-fill-y" x="436" y="172" width="190" height="38" fill={`url(#${P}topeni)`} />
            </g>
            <g className="ml-fade" style={{ animationDelay: '2s' }} fill="#ffffff">
              <text x="450" y="200.5" fontSize="25" fontWeight="900" letterSpacing="1">
                TOPENÍ
              </text>
              {/* radiator */}
              <rect x="582" y="179" width="5" height="21" rx="2.5" />
              <rect x="589" y="179" width="5" height="21" rx="2.5" />
              <rect x="596" y="179" width="5" height="21" rx="2.5" />
              <rect x="603" y="179" width="5" height="21" rx="2.5" />
              <rect x="610" y="179" width="5" height="21" rx="2.5" />
              <rect x="584" y="200" width="2.2" height="4" />
              <rect x="610.8" y="200" width="2.2" height="4" />
            </g>

            {/* services */}
            {TAGLINE.map((item, i) => (
              <g key={item.word} className="ml-rise" style={{ animationDelay: `${2 + i * 0.09}s` }}>
                <circle cx={item.dot} cy="240" r="3" fill={item.color} />
                <text
                  x={item.x}
                  y="246"
                  textLength={item.len}
                  lengthAdjust="spacingAndGlyphs"
                  fontSize="15"
                  fontWeight="800"
                  fill="#f1f5f9"
                >
                  {item.word}
                </text>
              </g>
            ))}

            {/* underline */}
            <path
              className="ml-draw"
              style={{ ['--len' as string]: 380, animationDelay: '2.25s' } as React.CSSProperties}
              d="M272 264 L648 264"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
    </div>
  )
}

export default BrandLogoAnimated
