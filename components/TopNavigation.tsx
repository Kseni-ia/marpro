'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import WorkApplicationForm from './WorkApplicationForm'
import { Menu, X } from 'lucide-react'

export default function TopNavigation() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle hash scrolling on component mount
  useEffect(() => {
    if (window.location.hash === '#contact') {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const contactElement = document.getElementById('contact')
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  const navigateToSection = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false) // Close menu after navigation
  }

  const handleWorkWithUs = () => {
    setShowWorkForm(true)
  }

  const handleContact = () => {
    setMobileMenuOpen(false) // Close menu
    // Navigate to home page first, then scroll to contact section
    const currentPath = window.location.pathname
    if (currentPath !== '/') {
      // If not on home page, navigate to home page with contact hash
      router.push('/#contact')
    } else {
      // If already on home page, scroll to contact section
      const contactElement = document.getElementById('contact')
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-gray-dark-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            {/* Logo - centered */}
            <div className="absolute left-4 sm:left-6 flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="MARPRO" 
                className="h-12 w-auto cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                onClick={() => navigateToSection('/')}
              />
            </div>

            {/* Navigation Items - centered */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateToSection('/')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {language === 'cs' ? 'Hlavní' : language === 'ru' ? 'Главная' : 'Main'}
              </button>
              <button 
                onClick={handleContact}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {language === 'cs' ? 'Kontakt' : language === 'ru' ? 'Контакт' : 'Contact Us'}
              </button>
              <button 
                onClick={() => navigateToSection('/Container')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {t('nav.containers')}
              </button>
              <button 
                onClick={() => navigateToSection('/Excavator')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {t('nav.excavators')}
              </button>
              <button 
                onClick={() => navigateToSection('/Construction')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {t('nav.constructions')}
              </button>
              <button 
                onClick={handleWorkWithUs}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {language === 'cs' ? 'Spolupráce' : language === 'ru' ? 'Сотрудничество' : 'Work With Us'}
              </button>
            </div>

            {/* Hamburger menu button - positioned on the right */}
            <div className="absolute right-4 sm:right-6 md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 p-2 hover:scale-110"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown - Right Side */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 right-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-2 border-gray-700/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[220px] overflow-hidden">
              <div className="flex flex-col py-3">
                <button 
                  onClick={() => navigateToSection('/')}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left border-b border-gray-700/30 hover:border-red-500/30"
                >
                  {language === 'cs' ? 'Hlavní' : language === 'ru' ? 'Главная' : 'Main'}
                </button>
                <button 
                  onClick={handleContact}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left border-b border-gray-700/30 hover:border-red-500/30"
                >
                  {language === 'cs' ? 'Kontakt' : language === 'ru' ? 'Контакт' : 'Contact Us'}
                </button>
                <button 
                  onClick={() => navigateToSection('/Container')}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left border-b border-gray-700/30 hover:border-red-500/30"
                >
                  {t('nav.containers')}
                </button>
                <button 
                  onClick={() => navigateToSection('/Excavator')}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left border-b border-gray-700/30 hover:border-red-500/30"
                >
                  {t('nav.excavators')}
                </button>
                <button 
                  onClick={() => navigateToSection('/Construction')}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left border-b border-gray-700/30 hover:border-red-500/30"
                >
                  {t('nav.constructions')}
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleWorkWithUs(); }}
                  className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 font-medium py-3.5 px-5 text-left"
                >
                  {language === 'cs' ? 'Spolupráce' : language === 'ru' ? 'Сотрудничество' : 'Work With Us'}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Work Application Form Modal */}
      {showWorkForm && (
        <WorkApplicationForm onClose={() => setShowWorkForm(false)} />
      )}
    </>
  )
}
