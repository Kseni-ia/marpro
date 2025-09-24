'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { validateAdminPassword } from '@/lib/adminAuth'

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (password: string) => {
    const isValid = await validateAdminPassword(password)
    if (isValid) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
    } else {
      throw new Error('Invalid password')
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
