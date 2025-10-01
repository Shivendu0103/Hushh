// Main assets export file
export { default as images, generateAvatar, hushhLogo, placeholderImages, iconAssets } from './images'
export { default as fonts, fontImports, fontCombinations, loadFonts } from './fonts'
export { default as sounds, soundEffects, audioManager, useAudio } from './sounds'
export { default as themes, applyTheme, getStoredTheme } from './themes'

// Initialize assets
export const initializeAssets = () => {
  // Load fonts
  fonts.loadFonts()
  
  // Apply stored theme
  const storedTheme = themes.getStoredTheme()
  themes.applyTheme(storedTheme)
  
  // Initialize audio (will wait for user interaction)
  sounds.audioManager.initialize()
  
  console.log('🎨 Hushh assets initialized')
}

// Asset preloader
export const preloadAssets = async (assetList = []) => {
  const promises = assetList.map(async (asset) => {
    try {
      if (asset.type === 'image') {
        const img = new Image()
        img.src = asset.url
        return new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
      } else if (asset.type === 'sound') {
        const audio = new Audio(asset.url)
        return new Promise((resolve, reject) => {
          audio.oncanplaythrough = resolve
          audio.onerror = reject
        })
      }
    } catch (error) {
      console.warn(`Failed to preload asset: ${asset.url}`, error)
    }
  })
  
  const results = await Promise.allSettled(promises)
  const loaded = results.filter(r => r.status === 'fulfilled').length
  
  console.log(`📦 Preloaded ${loaded}/${assetList.length} assets`)
  return { loaded, total: assetList.length }
}

export default {
  images,
  fonts,
  sounds,
  themes,
  initializeAssets,
  preloadAssets
}
