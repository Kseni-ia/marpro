'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import SocialMediaLinks from '@/components/SocialMediaLinks'

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  // Company address
  const addresses = [
    {
      city: 'Praha 10 - Strašnice',
      street: 'Kolovratská 58/1',
      zip: '100 00',
      country: 'Česká Republika'
    }
  ]

  return (
    <footer id="contact" className="w-full py-12 mt-24 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Company Info & Addresses */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-red-500 text-lg font-bold uppercase tracking-wider mb-4">
              TZB MARPRO — MARPRO S.R.O.
            </h3>
            <div className="space-y-3">
              {addresses.map((address, index) => (
                <div key={index} className="text-gray-dark-text text-sm">
                  <p className="font-medium text-gray-dark-textSecondary">{address.city}</p>
                  <p>{address.street}</p>
                  <p>{address.zip}</p>
                  <p>{address.country}</p>
                  <div className="mt-3 space-y-1">
                    <p>IČO: 08959439</p>
                    <p>DIČ (DPH): CZ08959439</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-red-500 text-lg font-bold uppercase tracking-wider mb-4">
              {t('footer.contact') || 'Kontakt'}
            </h3>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-dark-text hover:text-red-400 transition-colors duration-300">
                <span className="text-red-500 text-base">✉</span>
                <a 
                  href="mailto:marprostav@outlook.cz" 
                  className="text-sm font-medium hover:underline"
                >
                  marprostav@outlook.cz
                </a>
              </div>
              
              {/* Phone */}
              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-dark-text hover:text-red-400 transition-colors duration-300">
                <span className="text-red-500 text-base">📞</span>
                <a 
                  href="tel:+420607428667" 
                  className="text-sm font-medium hover:underline"
                >
                  +420 607 428 667
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-red-500 text-lg font-bold uppercase tracking-wider mb-4">
              {t('footer.followUs') || 'Sledujte nás'}
            </h3>
            <SocialMediaLinks />
          </div>
        </div>
        <div className="border-t border-gray-dark-border/30 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-dark-textSecondary text-xs">
              © {currentYear} MARPRO S.R.O.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
