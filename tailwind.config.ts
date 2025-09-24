import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-width': 'pulseWidth 2s infinite',
        'rotate-slow': 'rotate 10s linear infinite',
        'slide-shine': 'slideShine 0.5s',
        'logo-M': 'logoM 2.5s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'logo-A1': 'logoA1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.15s forwards',
        'logo-A2': 'logoA2 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.3s forwards',
        'logo-R1': 'logoR1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.45s forwards',
        'logo-R2': 'logoR2 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.6s forwards',
        'logo-P1': 'logoP1 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.75s forwards',
        'logo-R3': 'logoR3 2.5s cubic-bezier(0.5, 0, 0.5, 1) 0.9s forwards',
        'logo-R4': 'logoR4 2.5s cubic-bezier(0.5, 0, 0.5, 1) 1.05s forwards',
        'logo-O': 'logoO 2.5s cubic-bezier(0.5, 0, 0.5, 1) 1.2s forwards',
        'logo-shadow-M': 'logoM 2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'logo-shadow-A1': 'logoA1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.1s forwards',
        'logo-shadow-A2': 'logoA2 2s cubic-bezier(0.5, 0, 0.5, 1) 0.2s forwards',
        'logo-shadow-R1': 'logoR1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.3s forwards',
        'logo-shadow-R2': 'logoR2 2s cubic-bezier(0.5, 0, 0.5, 1) 0.4s forwards',
        'logo-shadow-P1': 'logoP1 2s cubic-bezier(0.5, 0, 0.5, 1) 0.5s forwards',
        'logo-shadow-R3': 'logoR3 2s cubic-bezier(0.5, 0, 0.5, 1) 0.6s forwards',
        'logo-shadow-R4': 'logoR4 2s cubic-bezier(0.5, 0, 0.5, 1) 0.7s forwards',
        'logo-shadow-O': 'logoO 2s cubic-bezier(0.5, 0, 0.5, 1) 0.8s forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        glow: {
          'from': { filter: 'brightness(1)' },
          'to': { filter: 'brightness(1.2)' }
        },
        pulseWidth: {
          '0%, 100%': { width: '100px', opacity: '0.6' },
          '50%': { width: '150px', opacity: '1' }
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        slideShine: {
          'to': { left: '100%' }
        },
        logoM: {
          'from': { strokeDashoffset: '180', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoA1: {
          'from': { strokeDashoffset: '120', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoA2: {
          'from': { strokeDashoffset: '30', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoR1: {
          'from': { strokeDashoffset: '150', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoR2: {
          'from': { strokeDashoffset: '40', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoP1: {
          'from': { strokeDashoffset: '120', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoR3: {
          'from': { strokeDashoffset: '150', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoR4: {
          'from': { strokeDashoffset: '40', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        },
        logoO: {
          'from': { strokeDashoffset: '140', opacity: '0' },
          '10%': { opacity: '1' },
          'to': { strokeDashoffset: '0', opacity: '1' }
        }
      },
      backgroundImage: {
        'gradient-main-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1f1f1f 50%, #2d2d2d 75%, #242424 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, #2d2d2d 0%, #333333 100%)',
        'gradient-card-hover-dark': 'linear-gradient(135deg, #333333, #3a3a3a)',
        'gradient-button-dark': 'linear-gradient(135deg, #3a3a3a, #404040)',
        'gradient-maintenance-dark': 'linear-gradient(135deg, rgba(45,45,45,0.95) 0%, rgba(51,51,51,0.95) 100%)',
        'gradient-shine-dark': 'linear-gradient(90deg, transparent, rgba(100, 100, 100, 0.2), transparent)',
        'gradient-radial-dark': 'radial-gradient(circle, rgba(100,100,100,0.1) 0%, transparent 70%)',
        'gradient-radial-hover-dark': 'radial-gradient(circle, rgba(100,100,100,0.15) 0%, transparent 60%)'
      },
      colors: {
        gray: {
          dark: {
            bg: '#1a1a1a',
            card: '#2d2d2d',
            border: '#404040',
            text: '#e0e0e0',
            textSecondary: '#b0b0b0',
            textMuted: '#888888'
          }
        },
        red: {
          700: '#b91c1c'
        }
      }
    }
  },
  plugins: [],
}
export default config
