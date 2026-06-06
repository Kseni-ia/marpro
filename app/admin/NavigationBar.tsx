'use client'

import React, { useState, Fragment, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Calendar, LogOut, Home, ChevronRight, ChevronLeft, Truck, FileText, Hammer, Menu, X, Tractor, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavigationBarProps {
  onScheduleClick: () => void
  onLogout: () => void
}

export default function NavigationBar({ onScheduleClick, onLogout }: NavigationBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getButtonClass = (path: string, compact: boolean) => {
    const active = pathname === path
    const base = `flex items-center transition-all duration-300 rounded-xl ${
      compact ? 'w-10 h-10 justify-center mx-auto' : 'w-full h-12 justify-start gap-3 px-4'
    }`
    if (active) {
      return `${base} text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]`
    }
    return `${base} text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent`
  }

  return (
    <Fragment>
      {/* Desktop/Tablet: Left Sidebar */}
      <div
        ref={sidebarRef}
        className={`hidden md:flex fixed left-4 top-20 bottom-4 bg-[#080c16]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex-col py-4 z-50 transition-all duration-300 ${
          isOpen ? 'w-56' : 'w-16'
        }`}
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="w-10 h-10 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center mb-6 transition-all duration-300 border border-white/10 mx-auto"
          title={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Divider */}
        <div className={`h-px bg-white/10 mb-6 transition-all duration-300 mx-auto ${isOpen ? 'w-48' : 'w-12'}`} />

        {/* Home Button */}
        <div className="w-full px-3 mb-4">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className={getButtonClass('/admin/dashboard', !isOpen)}
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
            className={`flex items-center transition-all duration-300 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent ${
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
            className={getButtonClass('/admin/newContainers', !isOpen)}
            title={t('admin.newContainers')}
          >
            <Truck className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{t('admin.newContainers')}</span>}
          </button>
        </div>

        {/* New Excavators Button */}
        <div className="w-full px-3 mb-4">
          <button
            onClick={() => router.push('/admin/newExcavators')}
            className={getButtonClass('/admin/newExcavators', !isOpen)}
            title={t('admin.newExcavators')}
          >
            <Tractor className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{t('admin.newExcavators')}</span>}
          </button>
        </div>

        {/* New Constructions Button */}
        <div className="w-full px-3 mb-4">
          <button
            onClick={() => router.push('/admin/newConstructions')}
            className={getButtonClass('/admin/newConstructions', !isOpen)}
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
            className={getButtonClass('/admin/workApplications', !isOpen)}
            title={t('admin.workApplications')}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{t('admin.workApplications')}</span>}
          </button>
        </div>

        <div className="w-full px-3 mb-4">
          <button
            onClick={() => router.push('/admin/cenik')}
            className={getButtonClass('/admin/cenik', !isOpen)}
            title="Ceník služeb"
          >
            <DollarSign className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Ceník služeb</span>}
          </button>
        </div>

        {/* Spacer to push logout to bottom */}
        <div className="flex-1" />

        {/* Divider */}
        <div className={`h-px bg-white/10 mb-4 transition-all duration-300 mx-auto ${isOpen ? 'w-48' : 'w-12'}`} />

        {/* Logout Button */}
        <div className="w-full px-3 mb-2">
          <button
            onClick={onLogout}
            className={`flex items-center transition-all duration-300 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent ${
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#080c16]/95 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Dashboard Button */}
          <button
            onClick={() => router.push('/admin/dashboard')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              pathname === '/admin/dashboard'
                ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
            title={t('admin.home')}
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Equipment Schedule Management Button */}
          <button
            onClick={onScheduleClick}
            className="w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent flex items-center justify-center transition-all duration-300"
            title={t('admin.schedule')}
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* Menu Button - Opens Right Side Navigation */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              mobileMenuOpen
                ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile: Right Side Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Right Side Menu */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#080c16]/95 backdrop-blur-md border-l border-white/10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-all duration-300"
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
                className={`w-full rounded-xl flex items-center gap-3 px-4 h-12 transition-all duration-300 ${
                  pathname === '/admin/newContainers'
                    ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.newContainers')}</span>
              </button>

              {/* New Excavators Button */}
              <button
                onClick={() => {
                  router.push('/admin/newExcavators')
                  setMobileMenuOpen(false)
                }}
                className={`w-full rounded-xl flex items-center gap-3 px-4 h-12 transition-all duration-300 ${
                  pathname === '/admin/newExcavators'
                    ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Tractor className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.newExcavators')}</span>
              </button>

              {/* New Constructions Button */}
              <button
                onClick={() => {
                  router.push('/admin/newConstructions')
                  setMobileMenuOpen(false)
                }}
                className={`w-full rounded-xl flex items-center gap-3 px-4 h-12 transition-all duration-300 ${
                  pathname === '/admin/newConstructions'
                    ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
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
                className={`w-full rounded-xl flex items-center gap-3 px-4 h-12 transition-all duration-300 ${
                  pathname === '/admin/workApplications'
                    ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t('admin.workApplications')}</span>
              </button>

              <button
                onClick={() => {
                  router.push('/admin/cenik')
                  setMobileMenuOpen(false)
                }}
                className={`w-full rounded-xl flex items-center gap-3 px-4 h-12 transition-all duration-300 ${
                  pathname === '/admin/cenik'
                    ? 'text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <DollarSign className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Ceník služeb</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  onLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 px-4 h-12 transition-all duration-300 border border-transparent"
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
