import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Smile, MapPin, Hash, X, Zap, Loader } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useRef } from 'react'

const CreatePost = ({ onPostCreate }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [media, setMedia] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  const fileInputRef = useRef(null)

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

    const selectedMood = mood ? moods.find(m => m.name === mood) : null

    const newPost = {
      content,
      mood: selectedMood || null,
      media: media.map(m => ({ url: m.url, type: m.type })),
    }

    onPostCreate?.(newPost)
    setContent('')
    setMood('')
    setMedia([])
    setIsExpanded(false)
    setShowMoodPicker(false)
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setIsUploading(true)
    const toastId = toast.loading('Uploading media...')

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('media', file))

      const res = await api.post('/upload/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res && res.media && Array.isArray(res.media)) {
        const newMedia = res.media.map(m => ({
          url: m.url || m,
          type: m.type || (m.mimetype?.startsWith('video/') ? 'video' : 'image')
        }))
        setMedia(prev => [...prev, ...newMedia])
        toast.success(`${newMedia.length} file(s) uploaded!`, { id: toastId })
      } else {
        throw new Error('Invalid upload response format')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload media', { id: toastId })
    } finally {
      setIsUploading(false)
      // Reset input so the same files can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const selectedMood = moods.find(m => m.name === mood)

  return (
    <GlassCard className="mb-8 sticky top-20 z-20 shadow-2xl shadow-purple-500/20" variant="neon">
      <div className="p-6 space-y-4">
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
                className="mt-4 space-y-3"
              >
                <div className="text-sm font-semibold text-gray-300 flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  {media.length} file{media.length !== 1 ? 's' : ''} attached
                </div>
                <div className={`grid gap-3 ${media.length === 1 ? 'grid-cols-1' : media.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {media.map((item, index) => (
                    <motion.div
                      key={index}
                      className="relative rounded-xl overflow-hidden group bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
                      whileHover={{ scale: 1.02 }}
                      layoutId={`media-${index}`}
                    >
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          className="w-full h-48 object-cover" 
                          onError={() => console.log('[v0] Video load error:', item.url)}
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={`Upload preview ${index + 1}`} 
                          className="w-full h-48 object-cover" 
                          onError={() => console.log('[v0] Image load error:', item.url)}
                        />
                      )}
                      <motion.button
                        type="button"
                        onClick={() => setMedia(media.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                      <div className="absolute bottom-2 left-2 bg-black/60 rounded-full px-2 py-1 text-xs text-white">
                        {item.type === 'video' ? '🎥 Video' : '🖼️ Image'}
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-all"
                    title="Add Media"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
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
                  disabled={!content.trim() || isUploading}
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
