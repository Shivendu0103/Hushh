// Theme configurations for Hushh
export const themes = {
  dark: {
    name: 'Dark Vibes',
    colors: {
      primary: '#8338ec',
      secondary: '#ff006e',
      accent: '#06ffa5',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: 'rgba(255, 255, 255, 0.1)',
      glass: 'rgba(255, 255, 255, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff006e, #8338ec)',
      secondary: 'linear-gradient(135deg, #8338ec, #3a86ff)',
      accent: 'linear-gradient(135deg, #06ffa5, #3a86ff)',
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
      neon: 'linear-gradient(135deg, #ff006e, #8338ec, #3a86ff, #06ffa5)'
    }
  },

  neon: {
    name: 'Neon Dreams',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#8000ff',
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: 'rgba(255, 0, 128, 0.3)',
      glass: 'rgba(255, 0, 128, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff0080, #00ff80)',
      secondary: 'linear-gradient(135deg, #00ff80, #8000ff)',
      accent: 'linear-gradient(135deg, #8000ff, #ff0080)',
      background: 'linear-gradient(135deg, #000000, #1a0033, #003311)',
      neon: 'linear-gradient(135deg, #ff0080, #00ff80, #8000ff)'
    }
  },

  cosmic: {
    name: 'Cosmic Journey',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#0c0c2e',
      surface: '#1a1a3e',
      text: '#ffffff',
      textSecondary: '#b8b8d1',
      border: 'rgba(102, 126, 234, 0.2)',
      glass: 'rgba(102, 126, 234, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea, #764ba2)',
      secondary: 'linear-gradient(135deg, #764ba2, #f093fb)',
      accent: 'linear-gradient(135deg, #f093fb, #f5576c)',
      background: 'linear-gradient(135deg, #0c0c2e, #1a1a3e, #2d1b69)',
      neon: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)'
    }
  },

  chaos: {
    name: 'Chaos Mode',
    colors: {
      primary: '#ff4757',
      secondary: '#ffa502',
      accent: '#3742fa',
      background: '#2f1b14',
      surface: '#3c2415',
      text: '#ffffff',
      textSecondary: '#f1c40f',
      border: 'rgba(255, 71, 87, 0.3)',
      glass: 'rgba(255, 71, 87, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff4757, #ffa502)',
      secondary: 'linear-gradient(135deg, #ffa502, #3742fa)',
      accent: 'linear-gradient(135deg, #3742fa, #ff4757)',
      background: 'linear-gradient(135deg, #2f1b14, #3c2415, #ff4757)',
      neon: 'linear-gradient(135deg, #ff4757, #ffa502, #3742fa, #2ed573)'
    }
  }
}

// Theme utility functions
export const getThemeColors = (themeName) => {
  return themes[themeName]?.colors || themes.dark.colors
}

export const getThemeGradients = (themeName) => {
  return themes[themeName]?.gradients || themes.dark.gradients
}

// CSS custom properties generator
export const generateThemeCSS = (themeName) => {
  const theme = themes[themeName] || themes.dark
  
  const cssVars = Object.entries(theme.colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n')
  
  const gradientVars = Object.entries(theme.gradients)
    .map(([key, value]) => `  --gradient-${key}: ${value};`)
    .join('\n')
  
  return `:root {\n${cssVars}\n${gradientVars}\n}`
}

// Apply theme to document
export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.dark
  const root = document.documentElement
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  // Apply gradient variables
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value)
  })
  
  // Store current theme
  localStorage.setItem('hushh_theme', themeName)
  
  console.log(`🎨 Applied theme: ${theme.name}`)
}

// Get stored theme
export const getStoredTheme = () => {
  return localStorage.getItem('hushh_theme') || 'dark'
}

// Theme animation presets
export const themeAnimations = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  sharp: 'cubic-bezier(0.4, 0, 1, 1)'
}

export default {
  themes,
  getThemeColors,
  getThemeGradients,
  generateThemeCSS,
  applyTheme,
  getStoredTheme,
  themeAnimations
}
