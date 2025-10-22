'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const [showDropdown, setShowDropdown] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageSelect = (langCode: 'en' | 'cs' | 'ru') => {
    setLanguage(langCode)
    setShowDropdown(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-full px-4 py-2 text-gray-dark-text hover:bg-gradient-card-hover-dark transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:scale-105 flex items-center gap-2"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium uppercase tracking-wider">
          {currentLang.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 bg-gradient-card-dark border-2 border-gray-dark-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden z-60 min-w-[140px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code as 'en' | 'cs' | 'ru')}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                  language === lang.code 
                    ? 'bg-red-600/20 text-red-400' 
                    : 'text-gray-dark-text hover:bg-gray-dark-accent hover:text-white'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-sm font-medium">{lang.code.toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{lang.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageToggle
