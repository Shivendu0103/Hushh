import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage or default to 'dark'
    return localStorage.getItem('hushh_theme') || 'dark'
  })

  const [appearance, setAppearance] = useState(() => {
    const stored = localStorage.getItem('hushh_appearance')
    return stored ? JSON.parse(stored) : {
      theme: 'dark',
      chaosMode: false,
      animations: true,
      glassIntensity: 'medium'
    }
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('hushh_theme', theme)
    localStorage.setItem('hushh_appearance', JSON.stringify(appearance))

    // Update HTML classes
    const html = document.documentElement
    
    // Remove old theme classes
    html.classList.remove('theme-dark', 'theme-neon', 'theme-cosmic')
    
    // Add new theme class
    html.classList.add(`theme-${appearance.theme}`)
    
    // Apply chaos mode
    if (appearance.chaosMode) {
      html.classList.add('chaos-mode')
    } else {
      html.classList.remove('chaos-mode')
    }
    
    // Apply animations
    if (!appearance.animations) {
      html.style.setProperty('--animations-disabled', '1')
    } else {
      html.style.removeProperty('--animations-disabled')
    }
  }, [theme, appearance])

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    setAppearance(prev => ({ ...prev, theme: newTheme }))
  }

  const updateAppearance = (key, value) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      appearance,
      updateTheme,
      updateAppearance
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
