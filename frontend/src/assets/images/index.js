// Default avatar generator
export const generateAvatar = (name, size = 100) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = size
  canvas.height = size
  
  // Generate color from name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  const bgColor = `hsl(${hue}, 70%, 50%)`
  const textColor = '#ffffff'
  
  // Draw background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)
  
  // Draw initials
  ctx.fillStyle = textColor
  ctx.font = `bold ${size * 0.4}px Inter, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
  
  ctx.fillText(initials, size / 2, size / 2)
  
  return canvas.toDataURL()
}

// Logo SVG as data URL
export const hushhLogo = `data:image/svg+xml,${encodeURIComponent(`
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hushhGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff006e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8338ec;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3a86ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main circle -->
  <circle cx="50" cy="50" r="45" fill="url(#hushhGradient)" opacity="0.9"/>
  
  <!-- Inner glow -->
  <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  
  <!-- H letter stylized -->
  <path d="M30 30 L30 70 M70 30 L70 70 M30 50 L70 50" 
        stroke="white" 
        stroke-width="4" 
        stroke-linecap="round" 
        fill="none"/>
  
  <!-- Sparkle effects -->
  <circle cx="25" cy="25" r="2" fill="white" opacity="0.8"/>
  <circle cx="75" cy="25" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="80" cy="70" r="2" fill="white" opacity="0.7"/>
  <circle cx="20" cy="75" r="1.5" fill="white" opacity="0.5"/>
</svg>
`)}`

// Placeholder images for different scenarios
export const placeholderImages = {
  // Profile placeholders
  avatarPlaceholder: generateAvatar('User'),
  
  // Post placeholders
  postImagePlaceholder: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#1a1a2e"/>
      <rect x="50" y="50" width="300" height="200" fill="#16213e" rx="10"/>
      <circle cx="200" cy="120" r="30" fill="#0f3460"/>
      <rect x="150" y="160" width="100" height="60" fill="#0f3460" rx="5"/>
      <text x="200" y="250" text-anchor="middle" fill="#666" font-family="Arial" font-size="14">
        Image Placeholder
      </text>
    </svg>
  `)}`,
  
  // Cover image placeholder
  coverPlaceholder: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#coverGradient)"/>
      <circle cx="200" cy="150" r="50" fill="rgba(255,255,255,0.1)"/>
      <circle cx="600" cy="100" r="80" fill="rgba(255,255,255,0.1)"/>
      <circle cx="400" cy="300" r="60" fill="rgba(255,255,255,0.1)"/>
    </svg>
  `)}`,
  
  // Loading placeholder
  loadingPlaceholder: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#1a1a2e"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="#8338ec" stroke-width="4">
        <animate attributeName="r" values="0;30;0" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `)}`,
}

// Icon assets as SVG strings
export const iconAssets = {
  // Social media icons
  heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  
  fire: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.28 2.67-.2 3.88-.74 1.87-2.19 2.96-4.01 2.96z"/></svg>`,
  
  sparkle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 6L20 4.5l-6.5 1.5L12 12l-1.5-6L4 4.5l6.5-1.5L12 0zm7 13l1 3 3-1-3-1-1-3-1 3-3 1 3 1 1 3z"/></svg>`,
  
  lightning: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`,
  
  // Mood icons
  cosmic: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>`,
  
  chaos: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
}

export default {
  generateAvatar,
  hushhLogo,
  placeholderImages,
  iconAssets
}
