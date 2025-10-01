export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff006e',
          purple: '#8338ec', 
          cyan: '#06ffa5',
          blue: '#3a86ff'
        }
      },
      fontFamily: {
        'druk': ['Druk', 'sans-serif'],
        'monument': ['Monument Extended', 'sans-serif']
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(255, 0, 110, 0.5)' },
          '100%': { 'box-shadow': '0 0 30px rgba(131, 56, 236, 0.8)' }
        }
      }
    }
  },
  plugins: []
}
