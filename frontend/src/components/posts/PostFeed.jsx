import { motion } from 'framer-motion'

const PostFeed = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black neon-text flex items-center justify-center">
          Your Feed ✨
        </h2>
        <p className="text-gray-400 mt-2">What's vibing in your universe</p>
      </div>

      {/* Sample posts */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass glass-hover p-6 rounded-3xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
            <div>
              <h3 className="font-bold text-white">Demo User {i}</h3>
              <p className="text-gray-400 text-sm">@demo_user_{i}</p>
            </div>
          </div>
          
          <p className="text-white text-lg mb-4">
            This is an epic post from the future! Hushh is absolutely incredible with these glassmorphism effects! 🚀✨
          </p>
          
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-pink-500 transition-all">
              <span>❤️</span>
              <span className="text-white">{10 + i * 5}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all">
              <span>💬</span>
              <span className="text-white">{3 + i}</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PostFeed
