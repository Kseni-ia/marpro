'use client'

import React, { useState, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, Home, ChevronRight, ChevronLeft, Package, Truck, FileText, Hammer, Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavigationBarProps {
  onScheduleClick: () => void
  onLogout: () => void
}

export default function NavigationBar({ onScheduleClick, onLogout }: NavigationBarProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

      {/* Home Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title={t('admin.home')}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.home')}</span>}
        </button>
      </div>

      {/* Schedule Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={onScheduleClick}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title={t('admin.schedule')}
        >
          <Calendar className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.schedule')}</span>}
        </button>
      </div>

      {/* New Containers Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/newContainers')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title={t('admin.newContainers')}
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.newContainers')}</span>}
        </button>
      </div>

      {/* New Excavators Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/newExcavators')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title={t('admin.newExcavators')}
        >
          <Truck className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.newExcavators')}</span>}
        </button>
      </div>

      {/* New Constructions Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/newConstructions')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title="Správa staveb"
        >
          <Hammer className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Stavby</span>}
        </button>
      </div>

      {/* Work Applications Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/workApplications')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title={t('admin.workApplications')}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.workApplications')}</span>}
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
          title={t('admin.logout')}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">{t('admin.logout')}</span>}
        </button>
      </div>
    </div>

      {/* Mobile: Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-red-900/30 z-20">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Dashboard Button */}
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title={t('admin.home')}
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Equipment Schedule Management Button */}
          <button
            onClick={onScheduleClick}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title={t('admin.schedule')}
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* Menu Button - Opens Right Side Navigation */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile: Right Side Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Right Side Menu */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-black/95 backdrop-blur-md border-l border-red-900/30 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-red-900/30">
              <h2 className="text-white font-semibold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-red-950/40 text-white hover:bg-red-900/60 flex items-center justify-center transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* New Containers Button */}
              <button
                onClick={() => {
                  router.push('/admin/newContainers')
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center gap-3 px-4 h-12 transition-all duration-300 border-2 border-red-900/50"
              >
                <Package className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.newContainers')}</span>
              </button>

              {/* New Excavators Button */}
              <button
                onClick={() => {
                  router.push('/admin/newExcavators')
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center gap-3 px-4 h-12 transition-all duration-300 border-2 border-red-900/50"
              >
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.newExcavators')}</span>
              </button>

              {/* New Constructions Button */}
              <button
                onClick={() => {
                  router.push('/admin/newConstructions')
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center gap-3 px-4 h-12 transition-all duration-300 border-2 border-red-900/50"
              >
                <Hammer className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Stavby</span>
              </button>

              {/* Work Applications Button */}
              <button
                onClick={() => {
                  router.push('/admin/workApplications')
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center gap-3 px-4 h-12 transition-all duration-300 border-2 border-red-900/50"
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.workApplications')}</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-red-900/30">
              <button
                onClick={() => {
                  onLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl bg-red-950/40 text-white hover:bg-red-600/40 hover:text-white hover:border-red-500 flex items-center gap-3 px-4 h-12 transition-all duration-300 border-2 border-red-900/50"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}
