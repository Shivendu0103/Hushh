import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useState } from 'react'

const FloatingButton = ({ onChaosMode }) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
    onChaosMode?.()
  }

  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full z-50 flex items-center justify-center ${
        isActive 
          ? 'neon-gradient animate-spin' 
          : 'glass hover:bg-white/20'
      } transition-all duration-300`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
    >
      <Zap className="w-6 h-6 text-white" />
    </motion.button>
  )
}

export default FloatingButton
