import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Smile, MapPin, Hash, X, Zap } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import { useAuth } from '../../context/AuthContext'

const CreatePost = ({ onPostCreate }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [media, setMedia] = useState([])
  const [showMoodPicker, setShowMoodPicker] = useState(false)

  const moods = [
    { name: 'fire', emoji: '🔥', color: 'from-red-500 to-orange-500', label: 'On Fire' },
    { name: 'chill', emoji: '😌', color: 'from-blue-500 to-cyan-500', label: 'Chill Vibes' },
    { name: 'chaos', emoji: '🌈', color: 'from-yellow-400 to-purple-600', label: 'Chaos Mode' },
    { name: 'love', emoji: '💜', color: 'from-pink-500 to-purple-500', label: 'Loving It' },
    { name: 'cosmic', emoji: '🌌', color: 'from-indigo-500 to-purple-600', label: 'Cosmic' },
    { name: 'electric', emoji: '⚡', color: 'from-yellow-400 to-blue-500', label: 'Electric' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    const newPost = {
      id: Date.now(),
      author: {
        username: user.username,
        displayName: user.profile?.displayName || user.username,
        avatar: user.profile?.avatar || '/default-avatar.png'
      },
      content,
      media,
      mood: mood ? moods.find(m => m.name === mood) : null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date()
    }

    onPostCreate?.(newPost)
    setContent('')
    setMood('')
    setMedia([])
    setIsExpanded(false)
    setShowMoodPicker(false)
  }

  const selectedMood = moods.find(m => m.name === mood)

  return (
    <GlassCard className="mb-6" variant="neon">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-4">
          <motion.div 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={user?.profile?.avatar || "/default-avatar.png"}
              alt={user?.username}
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-bold text-white">
              What's your vibe, {user?.profile?.displayName || user?.username}?
            </h3>
            <p className="text-gray-400 text-sm">Share your energy with the world ✨</p>
          </div>
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's happening in your universe? 🌌"
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-lg leading-relaxed"
              rows={isExpanded ? 4 : 2}
              maxLength={280}
            />
            
            {/* Character Counter */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-2 right-2 text-xs text-gray-400"
              >
                {content.length}/280
              </motion.div>
            )}
          </div>

          {/* Media Preview */}
          <AnimatePresence>
            {media.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 grid grid-cols-2 gap-2"
              >
                {media.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={item.preview}
                      alt="Upload preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setMedia(media.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mood Selector */}
          <AnimatePresence>
            {showMoodPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 glass rounded-xl"
              >
                <h4 className="text-white font-semibold mb-3">Choose your vibe ✨</h4>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((moodOption) => (
                    <motion.button
                      key={moodOption.name}
                      type="button"
                      onClick={() => {
                        setMood(moodOption.name)
                        setShowMoodPicker(false)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        mood === moodOption.name
                          ? `bg-gradient-to-r ${moodOption.color} text-white`
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{moodOption.emoji}</div>
                      <div className="text-xs font-medium">{moodOption.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Mood Display */}
          {selectedMood && !showMoodPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedMood.color}`}
            >
              <span className="text-xl">{selectedMood.emoji}</span>
              <span className="text-white font-medium text-sm">{selectedMood.label} vibes</span>
              <button
                type="button"
                onClick={() => setMood('')}
                className="text-white/80 hover:text-white ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Actions Bar */}
          <AnimatePresence>
            {(isExpanded || content) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center justify-between mt-6 pt-4 border-t border-white/10"
              >
                {/* Media Buttons */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-all"
                    title="Add Image"
                  >
                    <Image className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-green-400 transition-all"
                    title="Add Video"
                  >
                    <Video className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg transition-all ${
                      showMoodPicker || mood
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-purple-400'
                    }`}
                    title="Add Mood"
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-400 transition-all"
                    title="Add Location"
                  >
                    <MapPin className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Post Button */}
                <NeonButton
                  type="submit"
                  disabled={!content.trim()}
                  size="sm"
                  icon={<Zap />}
                  className="min-w-[100px]"
                >
                  Post Vibe
                </NeonButton>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </GlassCard>
  )
}

export default CreatePost
