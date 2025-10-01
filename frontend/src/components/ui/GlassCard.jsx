import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const GlassCard = ({ 
  children, 
  className = "",
  variant = "default",
  animated = true,
  glow = false,
  ...props 
}) => {
  const variants = {
    default: "glass glass-hover",
    neon: "glass glass-hover glow-purple",
    pink: "glass glass-hover glow-pink",
    minimal: "bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
  }

  const Component = animated ? motion.div : 'div'
  
  const animationProps = animated ? {
    whileHover: { 
      scale: 1.02, 
      y: -4,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    whileTap: { scale: 0.98 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <Component
      className={clsx(
        variants[variant],
        glow && "animate-pulse-neon",
        "relative overflow-hidden",
        className
      )}
      {...animationProps}
      {...props}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  )
}

export default GlassCard
