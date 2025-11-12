'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import WorkApplicationForm from './WorkApplicationForm'

export default function TopNavigation() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [showWorkForm, setShowWorkForm] = useState(false)

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
  }

  const handleWorkWithUs = () => {
    setShowWorkForm(true)
  }

  const handleContact = () => {
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

            {/* Mobile menu button - positioned on the right */}
            <div className="absolute right-4 sm:right-6 md:hidden">
              <button 
                onClick={handleWorkWithUs}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium text-sm hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {language === 'cs' ? 'Spolupráce' : language === 'ru' ? 'Сотрудничество' : 'Work With Us'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - centered */}
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 items-center">
              <button 
                onClick={handleContact}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium py-2 hover:scale-105"
              >
                {language === 'cs' ? 'Kontakt' : language === 'ru' ? 'Контакт' : 'Contact Us'}
              </button>
              <button 
                onClick={() => navigateToSection('/Container')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium py-2 hover:scale-105"
              >
                {t('nav.containers')}
              </button>
              <button 
                onClick={() => navigateToSection('/Excavator')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium py-2 hover:scale-105"
              >
                {t('nav.excavators')}
              </button>
              <button 
                onClick={() => navigateToSection('/Construction')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium py-2 hover:scale-105"
              >
                {t('nav.constructions')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Work Application Form Modal */}
      {showWorkForm && (
        <WorkApplicationForm onClose={() => setShowWorkForm(false)} />
      )}
    </>
  )
}
