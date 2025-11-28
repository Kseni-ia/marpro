'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(password)
      router.push('/admin/dashboard')
    } catch (error: any) {
      setError(t('admin.invalidPassword'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container - fits within layout */}
      <div className="absolute top-4 left-4 z-30">
        <Image 
          src="/logoDF.svg" 
          alt="MARPRO" 
          width={60}
          height={60}
          className="h-6 w-auto cursor-pointer transition-all duration-300 sm:h-7 md:h-8"
          onClick={() => router.push('/')}
        />
      </div>
      
      {/* Login Form Container */}
      <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-w-md w-full relative overflow-hidden group transition-all duration-[400ms] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark">
        {/* Shine effect */}
        <div className="absolute top-0 -left-full w-full h-full transition-all duration-500 pointer-events-none group-hover:left-full bg-gradient-shine-dark"></div>
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-dark-text mb-1 uppercase tracking-wider">{t('admin.login')}</h1>
          <p className="text-gray-dark-textSecondary">{t('admin.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-dark-textSecondary mb-2 uppercase tracking-wider">
              {t('admin.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-dark-bg border-2 border-gray-dark-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-dark-text placeholder-gray-dark-textMuted"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl uppercase tracking-wider"
          >
            {loading ? t('admin.signingIn') : t('admin.signIn')}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-dark-textSecondary hover:text-gray-dark-text text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="uppercase tracking-wider">{t('admin.backToWebsite')}</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
