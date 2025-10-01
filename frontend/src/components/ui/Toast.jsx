import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, Info, Zap } from 'lucide-react'

const Toast = ({ message, type = "info", onClose, visible = true }) => {
  const types = {
    success: {
      icon: <Check className="w-5 h-5" />,
      bgColor: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-300"
    },
    error: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: "from-red-500/20 to-pink-500/20", 
      borderColor: "border-red-500/30",
      textColor: "text-red-300"
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30", 
      textColor: "text-blue-300"
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-300"
    },
    hype: {
      icon: <Zap className="w-5 h-5" />,
      bgColor: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300"
    }
  }

  const config = types[type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            glass backdrop-blur-xl p-4 rounded-2xl border
            bg-gradient-to-r ${config.bgColor} ${config.borderColor}
            max-w-sm flex items-center space-x-3 shadow-2xl
          `}
        >
          {/* Icon */}
          <div className={`${config.textColor} flex-shrink-0`}>
            {config.icon}
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{message}</p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
