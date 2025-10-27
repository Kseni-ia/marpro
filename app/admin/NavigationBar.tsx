'use client'

import React, { useState, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, Home, ChevronRight, ChevronLeft, Package, Truck } from 'lucide-react'

interface NavigationBarProps {
  onScheduleClick: () => void
  onLogout: () => void
}

export default function NavigationBar({ onScheduleClick, onLogout }: NavigationBarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

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
          title="Home"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Home</span>}
        </button>
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

      {/* New Containers Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/newContainers')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title="New Containers"
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">New Containers</span>}
        </button>
      </div>

      {/* New Excavators Button */}
      <div className="w-full px-3 mb-4">
        <button
          onClick={() => router.push('/admin/newExcavators')}
          className={`rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center transition-all duration-300 border-2 border-red-900/50 ${
            isOpen ? 'w-full justify-start gap-3 px-4 h-12' : 'w-10 h-10 justify-center mx-auto'
          }`}
          title="New Excavators"
        >
          <Truck className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">New Excavators</span>}
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
          {/* Home Button */}
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Schedule Button */}
          <button
            onClick={onScheduleClick}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="Schedule"
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* New Containers Button */}
          <button
            onClick={() => router.push('/admin/newContainers')}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="New Containers"
          >
            <Package className="w-5 h-5" />
          </button>

          {/* New Excavators Button */}
          <button
            onClick={() => router.push('/admin/newExcavators')}
            className="w-12 h-12 rounded-xl bg-red-950/40 text-white hover:bg-red-900/60 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 border-2 border-red-900/50"
            title="New Excavators"
          >
            <Truck className="w-5 h-5" />
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
