/* Import Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import all custom styles */
@import './globals.css';
@import './components.css';
@import './animations.css';
@import './glassmorphism.css';
@import './themes.css';
@import './utilities.css';

/* 🌟 HUSHH BRAND COLORS & VARIABLES */
:root {
  /* Brand Colors */
  --hushh-primary: #8338ec;
  --hushh-secondary: #ff006e;
  --hushh-accent: #06ffa5;
  --hushh-blue: #3a86ff;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 20px;
  
  /* Shadows */
  --shadow-glow: 0 0 20px rgba(131, 56, 236, 0.3);
  --shadow-neon: 0 0 30px rgba(255, 0, 110, 0.5);
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #ff006e, #8338ec);
  --gradient-secondary: linear-gradient(135deg, #8338ec, #3a86ff);
  --gradient-neon: linear-gradient(135deg, #ff006e, #8338ec, #3a86ff, #06ffa5);
  --gradient-chaos: linear-gradient(135deg, #ff4757, #ffa502, #3742fa, #2ed573);
  
  /* Animations */
  --animation-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --animation-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --animation-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  --animation-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 🌙 Dark mode is default */
html {
  color-scheme: dark;
}

/* 📱 Base responsive design */
html, body {
  @apply h-full overflow-x-hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e);
}

/* 🎯 Selection styling */
::selection {
  background: var(--hushh-primary);
  color: white;
}

::-moz-selection {
  background: var(--hushh-primary);
  color: white;
}
