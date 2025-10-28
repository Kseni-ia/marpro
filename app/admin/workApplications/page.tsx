'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import NavigationBar from '@/app/admin/NavigationBar'
import ApplicationsList from './components/ApplicationsList'

export default function WorkApplicationsPage() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, authLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/admin')
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-main-dark flex items-center justify-center">
        <div className="text-gray-dark-text text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container */}
      <div className="absolute top-0 left-0 sm:-top-8 sm:-left-5 z-10 pointer-events-none">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={250}
          height={200}
          className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[170px] w-auto transition-all duration-300 object-contain"
          style={{ objectPosition: 'left top' }}
        />
      </div>
      
      {/* Left Navigation Bar */}
      <NavigationBar 
        onScheduleClick={() => {}}
        onLogout={handleLogout}
      />
      
      {/* Main Content Area */}
      <div className="relative md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16 sm:pt-12 md:pt-16 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-dark-text uppercase tracking-wider mb-2">
              Work Applications
            </h1>
            <p className="text-gray-dark-textSecondary text-sm sm:text-base">
              Manage all form submissions from customers
            </p>
          </div>

          {/* Applications List */}
          <ApplicationsList />
        </div>
      </div>
    </div>
  )
}
