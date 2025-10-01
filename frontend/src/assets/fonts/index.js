// Google Fonts imports and font configurations
export const fontImports = {
  // Modern, clean fonts for UI
  inter: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");',
  
  // Stylish display fonts
  poppins: '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");',
  
  // Futuristic fonts
  orbitron: '@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");',
  
  // Gaming/tech fonts
  rajdhani: '@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap");',
  
  // Elegant serif for special occasions
  playfair: '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap");'
}

// Font combinations for different contexts
export const fontCombinations = {
  default: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Poppins, sans-serif',
    mono: 'Monaco, Consolas, monospace'
  },
  
  gaming: {
    primary: 'Rajdhani, sans-serif',
    secondary: 'Orbitron, monospace',
    mono: 'Monaco, Consolas, monospace'
  },
  
  elegant: {
    primary: 'Playfair Display, serif',
    secondary: 'Inter, sans-serif',
    mono: 'Monaco, Consolas, monospace'
  },
  
  futuristic: {
    primary: 'Orbitron, monospace',
    secondary: 'Rajdhani, sans-serif',
    mono: 'Monaco, Consolas, monospace'
  }
}

// Load all fonts
export const loadFonts = () => {
  // Create style element
  const style = document.createElement('style')
  style.textContent = Object.values(fontImports).join('\n')
  document.head.appendChild(style)
}

// Font utility classes for Tailwind
export const fontClasses = {
  'font-display': fontCombinations.default.primary,
  'font-body': fontCombinations.default.secondary,
  'font-mono': fontCombinations.default.mono,
  'font-gaming': fontCombinations.gaming.primary,
  'font-futuristic': fontCombinations.futuristic.primary,
  'font-elegant': fontCombinations.elegant.primary
}

export default {
  fontImports,
  fontCombinations,
  loadFonts,
  fontClasses
}
