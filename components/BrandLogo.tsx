import React from 'react'
import { SWOOSH_BLUE, SWOOSH_BLUE_THIN, SWOOSH_ORANGE } from './brandLogoPaths'

/**
 * Shared artwork for the MARPRO "voda / topení" brand logo.
 *
 * This is a hand-built redraw of the printed logo. When the original vector
 * file is available, replace the artwork inside each `ml-*` group and keep the
 * class names — the homepage animation (BrandLogoAnimated) hooks onto them.
 *
 * `p` is an id prefix so several logos can live on one page without their
 * gradients/filters colliding.
 */

/** Emblem occupies roughly x 6–232, y 22–286 in user units. Ring centre: 128,158. */
export const EMBLEM_VIEWBOX = '4 20 232 268'

export function BrandDefs({ p }: { p: string }) {
  return (
    <defs>
      {/* steel, across the width of the wrench (local wrench coordinates) */}
      <linearGradient id={`${p}steel`} gradientUnits="userSpaceOnUse" x1="-16" y1="0" x2="16" y2="0">
        <stop offset="0" stopColor="#4b5563" />
        <stop offset="0.2" stopColor="#e5e7eb" />
        <stop offset="0.42" stopColor="#fafafa" />
        <stop offset="0.62" stopColor="#aeb6c1" />
        <stop offset="0.86" stopColor="#6b7280" />
        <stop offset="1" stopColor="#374151" />
      </linearGradient>
      <linearGradient id={`${p}steel-jaw`} x1="0" y1="0" x2="1" y2="0.75">
        <stop offset="0" stopColor="#f3f4f6" />
        <stop offset="0.3" stopColor="#cdd3da" />
        <stop offset="0.65" stopColor="#8e97a4" />
        <stop offset="1" stopColor="#4b5563" />
      </linearGradient>
      <linearGradient id={`${p}steel-dark`} gradientUnits="userSpaceOnUse" x1="-18" y1="0" x2="14" y2="0">
        <stop offset="0" stopColor="#1f2937" />
        <stop offset="0.3" stopColor="#9aa3ae" />
        <stop offset="0.5" stopColor="#d7dce2" />
        <stop offset="0.75" stopColor="#6b7280" />
        <stop offset="1" stopColor="#1f2937" />
      </linearGradient>
      <linearGradient id={`${p}recess`} gradientUnits="userSpaceOnUse" x1="-8" y1="0" x2="8" y2="0">
        <stop offset="0" stopColor="#374151" />
        <stop offset="0.5" stopColor="#7b8492" />
        <stop offset="1" stopColor="#4b5563" />
      </linearGradient>

      <radialGradient id={`${p}water`} cx="0.36" cy="0.42" r="0.75">
        <stop offset="0" stopColor="#bae6fd" />
        <stop offset="0.35" stopColor="#38bdf8" />
        <stop offset="0.75" stopColor="#0284c7" />
        <stop offset="1" stopColor="#075985" />
      </radialGradient>
      <linearGradient id={`${p}swoosh-blue`} gradientUnits="userSpaceOnUse" x1="20" y1="230" x2="215" y2="70">
        <stop offset="0" stopColor="#0369a1" />
        <stop offset="0.35" stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#7dd3fc" />
      </linearGradient>
      <linearGradient id={`${p}swoosh-orange`} gradientUnits="userSpaceOnUse" x1="30" y1="130" x2="160" y2="260">
        <stop offset="0" stopColor="#fdba74" />
        <stop offset="0.5" stopColor="#f97316" />
        <stop offset="1" stopColor="#dc2626" />
      </linearGradient>

      <linearGradient id={`${p}fire-outer`} x1="0.3" y1="1" x2="0.7" y2="0">
        <stop offset="0" stopColor="#b91c1c" />
        <stop offset="0.45" stopColor="#ea580c" />
        <stop offset="1" stopColor="#f97316" />
      </linearGradient>
      <linearGradient id={`${p}fire-mid`} x1="0.3" y1="1" x2="0.7" y2="0">
        <stop offset="0" stopColor="#ea580c" />
        <stop offset="0.6" stopColor="#fb923c" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id={`${p}fire-core`} x1="0.3" y1="1" x2="0.7" y2="0">
        <stop offset="0" stopColor="#fb923c" />
        <stop offset="1" stopColor="#fde68a" />
      </linearGradient>

      <filter id={`${p}shadow`} x="-20%" y="-10%" width="140%" height="125%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5" />
      </filter>
      <filter id={`${p}glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  )
}

const OUTLINE = '#0b1220'

function Wrench({ p }: { p: string }) {
  const steel = `url(#${p}steel)`
  return (
    <g filter={`url(#${p}shadow)`} stroke={OUTLINE} strokeWidth="1.3" strokeLinejoin="round">
      {/* hook (movable) jaw with threaded shank */}
      <path
        d="M-11 62 L-11 4 C-11 -12 -3 -19 12 -19 L34 -19 C44 -19 49 -14 49 -5 L49 23 L27 23 L27 8 C27 4 25 2 21 2 L13 2 C9 2 7 4 7 8 L7 62 Z"
        fill={`url(#${p}steel-jaw)`}
      />
      <path d="M27 23 l2.75 3.8 l2.75 -3.8 l2.75 3.8 l2.75 -3.8 l2.75 3.8 l2.75 -3.8 l2.75 3.8 l2.75 -3.8 Z" fill="#7b8492" strokeWidth="0.9" />
      <path d="M-8 -6 C-6 -13 0 -16 12 -16 L33 -16" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
      <g stroke="#1f2937" strokeWidth="1" opacity="0.55" fill="none">
        {[8, 11.6, 15.2, 18.8, 22.4, 26].map((y) => (
          <path key={y} d={`M-10.5 ${y} L6.5 ${y + 1.6}`} />
        ))}
      </g>

      {/* frame + heel jaw + handle, forged as one piece */}
      <path
        d="M-16 54 C-16 50 -14 48 -10 48 L14 48 L46 50 L49 66 L22 82 C17 85 14.5 88 14.5 94 L12 214 A12.6 12.6 0 1 1 -12 214 L-14.5 92 Z"
        fill={steel}
      />
      <path d="M17 48.2 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 l1.6 -3.3 l1.9 3.5 Z" fill="#7b8492" strokeWidth="0.9" />
      <path d="M20 61 L46.5 61 L47.6 66 L22 81 Z" fill="#111827" opacity="0.25" stroke="none" />
      {/* recessed web of the handle */}
      <path d="M-8 104 L8 104 L6.2 196 C6 201 -6 201 -6.2 196 Z" fill={`url(#${p}recess)`} strokeWidth="0.8" strokeOpacity="0.6" />
      <path d="M-11.6 98 L-9.6 208" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M-13.5 56 L-13.5 88" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="0" cy="219" r="4.6" fill="#0b1220" strokeWidth="0.8" />
      <path d="M-3.2 221.6 A4.6 4.6 0 0 0 3.2 221.6" fill="none" stroke="#e5e7eb" strokeWidth="0.9" opacity="0.6" />

      {/* knurled adjusting nut */}
      <rect x="-18" y="30" width="32" height="17" rx="3.5" fill={`url(#${p}steel-dark)`} />
      <g stroke="#0b1220" strokeWidth="1" opacity="0.6">
        {[-14, -10.6, -7.2, -3.8, -0.4, 3, 6.4, 9.8].map((x) => (
          <line key={x} x1={x} y1="32.5" x2={x} y2="44.5" />
        ))}
      </g>
      <path d="M-15 32.2 L11 32.2" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </g>
  )
}

/**
 * The emblem: steel pipe wrench with water and fire sweeping around it,
 * water drop and flame in front. Draw inside an svg whose user space matches
 * the full logo (or use EMBLEM_VIEWBOX for an emblem-only svg).
 */
export function BrandEmblem({ p }: { p: string }) {
  return (
    <g>
      {/* water + heat ring (behind the wrench) */}
      <g className="ml-swoosh ml-swoosh-blue">
        <circle cx="128" cy="158" r="122" fill="none" />
        <path d={SWOOSH_BLUE} fill={`url(#${p}swoosh-blue)`} />
        <path d={SWOOSH_BLUE_THIN} fill="#7dd3fc" opacity="0.9" />
      </g>
      <g className="ml-swoosh ml-swoosh-orange">
        <circle cx="128" cy="158" r="122" fill="none" />
        <path d={SWOOSH_ORANGE} fill={`url(#${p}swoosh-orange)`} />
      </g>

      {/* wrench */}
      <g transform="translate(94 150) rotate(5) translate(0 -105)">
        <g className="ml-wrench">
          <Wrench p={p} />
        </g>
      </g>

      {/* flame */}
      <g className="ml-flame">
        <ellipse className="ml-flame-glow" cx="176" cy="188" rx="46" ry="52" fill="#f97316" opacity="0.4" filter={`url(#${p}glow)`} />
        <g className="ml-flame-idle" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round">
          <path
            d="M112 214 C124 246 176 250 200 228 C222 208 226 170 210 124 C210 142 204 154 196 156 C200 138 196 118 182 102 C184 120 176 136 166 146 L150 192 C140 216 124 220 112 214 Z"
            fill={`url(#${p}fire-outer)`}
          />
          <path
            d="M126 222 C140 239 174 240 192 224 C208 208 212 180 205 152 C203 164 197 171 190 171 C193 155 191 138 182 124 C182 138 176 149 169 155 L153 197 C145 214 136 221 126 222 Z"
            fill={`url(#${p}fire-mid)`}
            stroke="none"
          />
          <path
            d="M152 228 C167 233 182 226 190 212 C198 198 198 184 195 172 C193 181 187 187 182 185 C184 173 183 162 178 152 C177 162 173 169 169 173 L161 201 C157 214 154 222 152 228 Z"
            fill={`url(#${p}fire-core)`}
            stroke="none"
          />
        </g>
      </g>

      {/* water drop */}
      <g className="ml-drop">
        <path
          d="M148 136 C148 136 118 170 118 188 A30 30 0 0 0 178 188 C178 170 148 136 148 136 Z"
          fill={`url(#${p}water)`}
          stroke="#083b5c"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M140 160 C132 170 126 180 126 189 C126 197 129 203 134 207 C131 198 132 184 140 160 Z" fill="#ffffff" opacity="0.6" />
        <path d="M172 192 C171 203 163 211 152 213 C163 215 174 206 172 192 Z" fill="#e0f2fe" opacity="0.35" />
      </g>
    </g>
  )
}

/**
 * Compact static logo for the navigation bar: emblem + wordmark.
 * The wordmark can be hidden at widths where the centred nav links need room.
 */
export function BrandLogoCompact({
  idPrefix = 'nav-',
  className = '',
  emblemClassName = 'h-11 w-auto sm:h-12',
  wordmarkClassName = 'h-6 w-auto sm:h-7',
}: {
  idPrefix?: string
  className?: string
  emblemClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        className={emblemClassName}
        viewBox={EMBLEM_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MARPRO"
      >
        <BrandDefs p={idPrefix} />
        <BrandEmblem p={idPrefix} />
      </svg>
      <svg
        className={wordmarkClassName}
        viewBox="0 0 300 78"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ fontFamily: 'inherit', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${idPrefix}chrome`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#b6c0cd" />
          </linearGradient>
        </defs>
        <g transform="skewX(-10)">
          <text x="18" y="58" textLength="272" lengthAdjust="spacingAndGlyphs" fontSize="60" fontWeight="900" fill={`url(#${idPrefix}chrome)`}>
            MARPRO
          </text>
          <text x="302" y="76" textAnchor="end" fontSize="12" fontWeight="800" letterSpacing="2" fill="#cbd5e1">
            S.R.O.
          </text>
          <rect x="18" y="68" width="110" height="3" rx="1.5" fill="#38bdf8" />
          <rect x="132" y="68" width="110" height="3" rx="1.5" fill="#f97316" />
        </g>
      </svg>
    </span>
  )
}
