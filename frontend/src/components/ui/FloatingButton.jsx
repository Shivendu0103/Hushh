import { motion } from 'framer-motion'
import { Plus, Zap, Music, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const FloatingButton = ({ onChaosMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const actions = [
    { icon: <Plus className="w-5 h-5" />, label: "New Post", color: "from-blue-500 to-cyan-500" },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Message", color: "from-green-500 to-emerald-500" },
    { icon: <Music className="w-5 h-5" />, label: "Music", color: "from-purple-500 to-pink-500" },
    { icon: <Zap className="w-5 h-5" />, label: "Chaos Mode", color: "from-yellow-400 to-red-500", action: onChaosMode }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <motion.div
        className="absolute bottom-16 right-0 space-y-3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          scale: isOpen ? 1 : 0,
          y: isOpen ? 0 : 20
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : 20
            }}
            transition={{ delay: index * 0.1 }}
            onClick={action.action}
            className={`
              glass backdrop-blur-lg p-3 rounded-full
              bg-gradient-to-r ${action.color}
              hover:scale-110 transition-all duration-200
              shadow-lg hover:shadow-2xl
              group flex items-center space-x-2
            `}
          >
            {action.icon}
            <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pr-2">
              {action.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-14 h-14 rounded-full neon-gradient
          flex items-center justify-center
          shadow-2xl hover:shadow-pink-500/25
          transition-all duration-300
        "
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>
    </div>
  )
}

export default FloatingButton
