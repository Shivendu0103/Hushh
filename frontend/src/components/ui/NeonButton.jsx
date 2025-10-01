import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const NeonButton = ({ 
  children, 
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon = null,
  ...props 
}) => {
  const variants = {
    primary: "neon-gradient text-white font-bold hover:shadow-2xl hover:shadow-pink-500/25",
    secondary: "bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20",
    ghost: "bg-transparent border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600",
    chaos: "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white animate-gradient bg-[length:400%_400%] hover:animate-pulse"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl", 
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-2xl"
  }

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 40px rgba(255, 0, 110, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        "relative transition-all duration-300 font-semibold",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center space-x-2",
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      
      {/* Icon */}
      {icon && !loading && (
        <span className="text-lg">{icon}</span>
      )}
      
      {/* Text */}
      {!loading && (
        <span>{children}</span>
      )}
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

export default NeonButton
