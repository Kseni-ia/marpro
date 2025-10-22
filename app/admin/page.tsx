'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(password)
      router.push('/admin/dashboard')
    } catch (error: any) {
      setError('Invalid password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main-dark relative">
      {/* Logo Container - Same as main page */}
      <div className="absolute top-0 left-0 sm:-top-14 sm:-left-12 z-30">
        <Image 
          src="/logo.svg" 
          alt="MARPRO" 
          width={250}
          height={200}
          className="h-[100px] sm:h-[120px] md:h-[150px] lg:h-[250px] w-auto cursor-pointer transition-all duration-300"
          onClick={() => router.push('/')}
        />
      </div>
      
      {/* Login Form Container */}
      <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gradient-card-dark border-2 border-gray-dark-border rounded-[20px] px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-w-md w-full relative overflow-hidden group transition-all duration-[400ms] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-gradient-card-hover-dark">
        {/* Shine effect */}
        <div className="absolute top-0 -left-full w-full h-full transition-all duration-500 pointer-events-none group-hover:left-full bg-gradient-shine-dark"></div>
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-dark-text mb-1 uppercase tracking-wider">Admin Login</h1>
          <p className="text-gray-dark-textSecondary">Access your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-dark-textSecondary mb-2 uppercase tracking-wider">
              Admin Password
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-dark-textSecondary hover:text-gray-dark-text text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="uppercase tracking-wider">Back to Website</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
