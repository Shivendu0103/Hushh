import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, User, Hash } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  // Sample search results
  const sampleResults = [
    { type: 'user', username: 'vibe_master', displayName: 'Vibe Master', avatar: '/default-avatar.png' },
    { type: 'user', username: 'cosmic_dreamer', displayName: 'Cosmic Dreamer', avatar: '/default-avatar.png' },
    { type: 'hashtag', tag: 'chaosmode', posts: 1337 },
    { type: 'hashtag', tag: 'glassmorphism', posts: 420 }
  ]

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term.length > 1) {
      setResults(sampleResults.filter(item => 
        item.username?.toLowerCase().includes(term.toLowerCase()) ||
        item.displayName?.toLowerCase().includes(term.toLowerCase()) ||
        item.tag?.toLowerCase().includes(term.toLowerCase())
      ))
    } else {
      setResults([])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4"
          >
            <GlassCard className="p-0 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users, hashtags..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    autoFocus
                  />
                  <button
                    onClick={onClose}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-60 overflow-y-auto">
                {searchTerm && results.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No results found for "{searchTerm}"
                  </div>
                ) : (
                  results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-b-0"
                    >
                      {result.type === 'user' ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                            <img
                              src={result.avatar}
                              alt={result.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{result.displayName}</h4>
                            <p className="text-gray-400 text-sm">@{result.username}</p>
                          </div>
                          <User className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">#{result.tag}</h4>
                            <p className="text-gray-400 text-sm">{result.posts} posts</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal
