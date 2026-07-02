'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useModal } from '@/contexts/ModalContext'
import { getInstallationCopy } from '@/lib/installationCopy'
import { getPriceListCopy } from '@/lib/priceListCopy'
import WorkApplicationForm from './WorkApplicationForm'
import { Menu, X, Home, Mail, Truck, Hammer, Wrench, Coins, Handshake, Images } from 'lucide-react'

export default function TopNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const { isModalOpen } = useModal()
  const installationCopy = getInstallationCopy(language)
  const priceListCopy = getPriceListCopy(language)
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle hash scrolling on component mount (e.g. #contact, #reference)
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const targetElement = document.getElementById(hash.slice(1))
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const menuElement = document.getElementById('mobile-menu')
        const menuButton = document.getElementById('mobile-menu-button')
        
        if (menuElement && !menuElement.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

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

  const referencesLabel = language === 'cs' ? 'Reference' : language === 'ru' ? 'Портфолио' : 'References'

  const handleReferences = () => {
    setMobileMenuOpen(false) // Close menu
    // References live on the Installation page; navigate there, then scroll to them.
    if (window.location.pathname !== '/Installation') {
      router.push('/Installation#reference')
    } else {
      const referenceElement = document.getElementById('reference')
      if (referenceElement) {
        referenceElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm border-b border-gray-dark-border/20 transition-all duration-300 ${isModalOpen ? 'z-1000' : 'z-50'}`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            {/* Logo - fits within navigation bar */}
            <div className="absolute left-4 top-4 z-50">
              <Image 
                src="/logoDF.svg" 
                alt="MARPRO" 
                width={40}
                height={40}
                priority
                className="h-6 w-auto cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] sm:h-7 md:h-8 lg:h-9"
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
                onClick={() => navigateToSection('/Installation')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {installationCopy.title}
              </button>
              <button
                onClick={handleReferences}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {referencesLabel}
              </button>
              <button
                onClick={() => navigateToSection('/Cenik')}
                className="text-gray-dark-textSecondary/90 hover:text-red-400 transition-all duration-300 font-medium hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                {priceListCopy.navLabel}
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
                id="mobile-menu-button"
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
            <div 
              id="mobile-menu"
              className={`md:hidden absolute top-16 right-4 bg-[#0c1322]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[240px] overflow-hidden transition-all duration-300 ${isModalOpen ? 'z-1000' : 'z-50'}`}
            >
              <div className="flex flex-col py-2.5">
                <button 
                  onClick={() => navigateToSection('/')}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Home className="w-4.5 h-4.5 opacity-80" />
                  <span>{language === 'cs' ? 'Hlavní' : language === 'ru' ? 'Главная' : 'Main'}</span>
                </button>
                <button 
                  onClick={handleContact}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    // Contact is hash based
                    typeof window !== 'undefined' && window.location.hash === '#contact'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Mail className="w-4.5 h-4.5 opacity-80" />
                  <span>{language === 'cs' ? 'Kontakt' : language === 'ru' ? 'Контакт' : 'Contact Us'}</span>
                </button>
                <button 
                  onClick={() => navigateToSection('/Container')}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/Container'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Truck className="w-4.5 h-4.5 opacity-80" />
                  <span>{t('nav.containers')}</span>
                </button>
                <button 
                  onClick={() => navigateToSection('/Excavator')}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/Excavator'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Hammer className="w-4.5 h-4.5 opacity-80" />
                  <span>{t('nav.excavators')}</span>
                </button>
                <button 
                  onClick={() => navigateToSection('/Installation')}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/Installation'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Wrench className="w-4.5 h-4.5 opacity-80" />
                  <span>{installationCopy.title}</span>
                </button>
                <button
                  onClick={handleReferences}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/Installation' && typeof window !== 'undefined' && window.location.hash === '#reference'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Images className="w-4.5 h-4.5 opacity-80" />
                  <span>{referencesLabel}</span>
                </button>
                <button
                  onClick={() => navigateToSection('/Cenik')}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 border-b border-white/[0.03] ${
                    pathname === '/Cenik'
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Coins className="w-4.5 h-4.5 opacity-80" />
                  <span>{priceListCopy.navLabel}</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleWorkWithUs(); }}
                  className={`flex items-center gap-3 font-semibold py-3.5 px-5 text-left transition-all duration-300 ${
                    showWorkForm
                      ? 'text-red-400 bg-gradient-to-r from-red-500/12 via-red-500/4 to-transparent border-l-2 border-l-red-500/80 pl-4.5'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.03] pl-5'
                  }`}
                >
                  <Handshake className="w-4.5 h-4.5 opacity-80" />
                  <span>{language === 'cs' ? 'Spolupráce' : language === 'ru' ? 'Сотрудничество' : 'Work With Us'}</span>
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
