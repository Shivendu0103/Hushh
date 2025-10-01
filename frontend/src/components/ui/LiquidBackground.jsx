import { motion } from 'framer-motion'

const LiquidBackground = ({ chaosMode = false }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated blobs */}
      <motion.div
        className={`absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          chaosMode ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: chaosMode ? 2 : 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 ${
          chaosMode ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
        }`}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: chaosMode ? 1.5 : 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 ${
          chaosMode ? 'bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
          rotate: [0, chaosMode ? 360 : 180, 0],
        }}
        transition={{
          duration: chaosMode ? 3 : 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Chaos mode extra effects */}
      {chaosMode && (
        <>
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-lime-400 to-yellow-500 opacity-30"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-25"
            animate={{
              x: [0, 100, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}
    </div>
  )
}

export default LiquidBackground
