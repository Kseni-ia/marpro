'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  // Social media links - add your actual URLs here
  const socialLinks = {
    instagram: 'https://instagram.com/yourprofile', 
    tiktok: 'https://www.tiktok.com/@marpro_s.r.o?_r=1&_t=ZN-91m9xvxrfPy',
    youtube: 'https://youtube.com/yourchannel'
  }

  // Company address
  const addresses = [
    {
      city: 'Praha 10 - Strašnice',
      street: 'Kolovratská 58/1',
      zip: '100 00',
      country: 'Česká republika'
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
              MARPRO S.R.O.
            </h3>
            <div className="space-y-3">
              {addresses.map((address, index) => (
                <div key={index} className="text-gray-dark-text text-sm">
                  <p className="font-medium text-gray-dark-textSecondary">{address.city}</p>
                  <p>{address.street}</p>
                  <p>{address.zip}</p>
                  <p>{address.country}</p>
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
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {/* Instagram 
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-dark-border/20 rounded-lg flex items-center justify-center text-gray-dark-text hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border border-gray-dark-border/30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>*/}

              {/* TikTok */}
              <a 
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-dark-border/20 rounded-lg flex items-center justify-center text-gray-dark-text hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border border-gray-dark-border/30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* YouTube 
              <a 
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-dark-border/20 rounded-lg flex items-center justify-center text-gray-dark-text hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border border-gray-dark-border/30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>*/}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-dark-border/30 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-dark-textSecondary text-xs">
              © 2025 MARPRO S.R.O.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
