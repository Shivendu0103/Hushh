/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f1e',
        foreground: '#f0f0f5',
        card: '#1a1a2e',
        'card-foreground': '#f0f0f5',
        primary: '#e91e8c',
        'primary-foreground': '#f0f0f5',
        secondary: '#d946a6',
        'secondary-foreground': '#f0f0f5',
        accent: '#b833d4',
        'accent-foreground': '#f0f0f5',
        muted: '#2d2d3d',
        'muted-foreground': '#8f8fa3',
        border: '#2d2d3d',
        destructive: '#ef4444',
        'destructive-foreground': '#f0f0f5',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
