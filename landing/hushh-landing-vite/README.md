# Hushh Landing Page - Vite + React + Tailwind v3

A modern, fully responsive landing page for the Hushh social platform built with Vite, React, Framer Motion, and Tailwind CSS v3.

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: JavaScript (JSX)

## Features

- ✨ Animated hero section with pink tree video background
- 🎯 Features showcase with icons
- 💬 Testimonials carousel
- 📝 Login/Signup forms with toggle
- 📱 Fully responsive design
- ⚡ Smooth animations with Framer Motion
- 🎨 Beautiful pink/magenta color theme
- 🔗 Sticky navigation bar

## Project Structure

```
src/
├── components/
│   ├── NavigationBar.jsx
│   ├── HeroSection.jsx
│   ├── FeaturesSection.jsx
│   ├── TestimonialsSection.jsx
│   ├── CTASection.jsx
│   └── Footer.jsx
├── pages/
│   └── LandingPage.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration with custom colors
- `postcss.config.js` - PostCSS configuration
- `vite.config.js` - Vite configuration
- `package.json` - Project dependencies and scripts

## Customization

### Colors
Edit the color theme in `tailwind.config.js`:
- Primary: `#e91e8c` (magenta)
- Accent: `#b833d4` (purple)
- Background: `#0f0f1e` (dark blue-black)

### Animations
Modify animation timings in component files or `tailwind.config.js` keyframes.

### Content
Update text, images, and links directly in the component files.

## Integration with Your Project

1. Copy the `src/components` folder to your project
2. Copy `tailwind.config.js` and `postcss.config.js` 
3. Install dependencies: `framer-motion` and `lucide-react`
4. Import and use `LandingPage` component in your app
5. Ensure Tailwind CSS is properly configured in your project

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Built for Hushh © 2024
