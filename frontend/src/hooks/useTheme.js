import { useState, useEffect, useCallback } from 'react'
import { themes, applyTheme, getStoredTheme } from '../assets/themes'

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme())
  const [isChanging, setIsChanging] = useState(false)

  // Apply theme on mount and when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  // Change theme with animation
  const changeTheme = useCallback(async (newTheme) => {
    if (newTheme === currentTheme || isChanging) return

    setIsChanging(true)

    // Optional: Add transition class to body
    document.body.classList.add('theme-transitioning')

    try {
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 150))
      
      setCurrentTheme(newTheme)
      applyTheme(newTheme)
      
      // Remove transition class after theme is applied
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning')
        setIsChanging(false)
      }, 300)
    } catch (error) {
      console.error('Theme change error:', error)
      setIsChanging(false)
      document.body.classList.remove('theme-transitioning')
    }
  }, [currentTheme, isChanging])

  // Cycle through themes
  const cycleTheme = useCallback(() => {
    const themeKeys = Object.keys(themes)
    const currentIndex = themeKeys.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themeKeys.length
    const nextTheme = themeKeys[nextIndex]
    
    changeTheme(nextTheme)
  }, [currentTheme, changeTheme])

  // Get current theme object
  const getTheme = useCallback(() => {
    return themes[currentTheme] || themes.dark
  }, [currentTheme])

  // Get available themes
  const getAvailableThemes = useCallback(() => {
    return Object.entries(themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      colors: theme.colors
    }))
  }, [])

  return {
    currentTheme,
    changeTheme,
    cycleTheme,
    getTheme,
    getAvailableThemes,
    isChanging,
    isDark: currentTheme === 'dark',
    isNeon: currentTheme === 'neon',
    isCosmic: currentTheme === 'cosmic',
    isChaos: currentTheme === 'chaos'
  }
}

export default useTheme
