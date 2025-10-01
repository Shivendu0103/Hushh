import { motion } from 'framer-motion'

const StatusBanner = ({ status, emoji, color, animated = true }) => {
  const statusStyles = {
    '🎧 Vibing': 'from-purple-600 to-pink-600',
    '📚 Grinding': 'from-blue-600 to-cyan-600',
    '🌌 Lost in thoughts': 'from-indigo-600 to-purple-600',
    '🔥 On fire': 'from-red-500 to-orange-500',
    '💫 Dreaming': 'from-pink-500 to-violet-500',
    '⚡ Chaos mode': 'from-yellow-400 via-red-500 to-purple-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        glass backdrop-blur-lg p-3 rounded-2xl
        bg-gradient-to-r ${statusStyles[status] || 'from-gray-600 to-gray-700'}
        inline-flex items-center space-x-2
        shadow-lg
      `}
    >
      {/* Animated emoji */}
      <motion.span
        className="text-2xl"
        animate={animated ? {
          scale: [1, 1.2, 1],
          rotate: status === '⚡ Chaos mode' ? [0, 10, -10, 0] : 0
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {emoji}
      </motion.span>
      
      {/* Status text */}
      <span className="text-white font-semibold text-sm px-2">
        {status}
      </span>
      
      {/* Pulsing indicator */}
      <motion.div
        className="w-2 h-2 bg-white rounded-full"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export default StatusBanner
