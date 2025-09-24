'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  // Always use dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark')
    setMounted(true)
  }, [])

  const value: ThemeContextType = {
    isDark: true
  }

  return (
    <ThemeContext.Provider value={value}>
      {/* Prevent hydration mismatch by hiding content until mounted */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden', position: 'relative', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
