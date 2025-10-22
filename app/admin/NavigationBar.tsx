'use client'

import React, { useState, Fragment } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Calendar, LogOut, Globe, ChevronRight, ChevronLeft } from 'lucide-react'

interface NavigationBarProps {
  onScheduleClick: () => void
  onLogout: () => void
}

export default function NavigationBar({ onScheduleClick, onLogout }: NavigationBarProps) {
  const { language, setLanguage } = useLanguage()
  const [expandedLanguage, setExpandedLanguage] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  return (
    <Fragment>
      {/* Desktop/Tablet: Left Sidebar */}
      <div className={`hidden md:flex fixed left-4 top-20 bottom-4 bg-black/95 backdrop-blur-md border border-red-900/30 rounded-2xl flex-col py-4 z-20 transition-all duration-300 ${
        isOpen ? 'w-56' : 'w-16'
      }`}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="w-10 h-10 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center mb-6 transition-all duration-300 border-2 border-red-900/50 mx-auto"
        title={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Divider */}
      <div className={`h-px bg-red-900/30 mb-6 transition-all duration-300 mx-auto ${
        isOpen ? 'w-48' : 'w-12'
      }`} />

      {/* Language Selector */}
      <div className="relative mb-4 w-full px-3">
        <button
          onClick={() => setExpandedLanguage(!expandedLanguage)}
          className={`rounded-xl flex items-center transition-all duration-300 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          } ${
            expandedLanguage 
              ? 'bg-red-600/30 text-white border-2 border-red-500/70' 
              : 'bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white border-2 border-red-900/50'
          }`}
          title="Language"
        >
          <Globe className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="text-sm font-medium">
              {language === 'en' ? 'English' : language === 'cs' ? 'Čeština' : 'Русский'}
            </span>
          )}
        </button>

        {/* Language Dropdown */}
        {expandedLanguage && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setExpandedLanguage(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute left-full ml-4 top-0 bg-black/95 backdrop-blur-md border border-red-900/50 rounded-xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] overflow-hidden z-40 min-w-[180px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as 'en' | 'cs' | 'ru')
                    setExpandedLanguage(false)
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                    language === lang.code 
                      ? 'bg-red-600/30 text-white border-l-4 border-red-500' 
                      : 'text-white/80 hover:bg-red-950/60 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{lang.code.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Schedule Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={onScheduleClick}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title="Schedule"
        >
          <Calendar className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Schedule</span>}
        </button>
      </div>

      {/* Spacer to push logout to bottom */}
      <div className="flex-1" />

      {/* Divider */}
      <div className={`h-px bg-red-900/30 mb-4 transition-all duration-300 mx-auto ${
        isOpen ? 'w-48' : 'w-12'
      }`} />

      {/* Logout Button */}
      <div className="w-full px-3 mb-2">
        <button
          onClick={onLogout}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-600/40 hover:text-white hover:border-red-500 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>

      {/* Mobile: Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-red-900/30 z-20">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setExpandedLanguage(!expandedLanguage)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                expandedLanguage 
                  ? 'bg-red-600/30 text-white border-2 border-red-500/70' 
                  : 'bg-red-950/40 text-white border-2 border-red-900/50'
              }`}
              title="Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Language Dropdown for Mobile */}
            {expandedLanguage && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setExpandedLanguage(false)}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/95 backdrop-blur-md border border-red-900/50 rounded-xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] overflow-hidden z-40 min-w-[180px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as 'en' | 'cs' | 'ru')
                        setExpandedLanguage(false)
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                        language === lang.code 
                          ? 'bg-red-600/30 text-white' 
                          : 'text-white/80 hover:bg-red-950/60 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-semibold text-sm">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Schedule Button */}
          <button
            onClick={onScheduleClick}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="Schedule"
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-600/40 hover:text-white hover:border-red-500 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Fragment>
  )
}
