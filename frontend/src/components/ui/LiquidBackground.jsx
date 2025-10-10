import { motion } from 'framer-motion'

const LiquidBackground = ({ chaosMode = false }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated blobs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl opacity-20 ${
            chaosMode ? 'animate-chaos' : ''
          }`}
          style={{
            background: `linear-gradient(135deg, 
              ${i % 2 === 0 ? '#ff006e' : '#8338ec'}, 
              ${i % 3 === 0 ? '#3a86ff' : '#06ffa5'})`,
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Particle effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

export default LiquidBackground
