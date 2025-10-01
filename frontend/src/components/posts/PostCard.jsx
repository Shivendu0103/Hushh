import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(false)
  const [showEmojiExplosion, setShowEmojiExplosion] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setShowEmojiExplosion(true)
    setTimeout(() => setShowEmojiExplosion(false), 1000)
    onLike?.(post.id)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <GlassCard className="mb-6 relative overflow-hidden" variant="default" animated>
      {/* Emoji Explosion Effect */}
      <AnimatePresence>
        {showEmojiExplosion && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {['🔥', '💫', '✨', '💜', '🌈', '⚡', '🎉'].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0,
                  rotate: 0 
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1.5, 0],
                  rotate: 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={post.author.avatar || "/default-avatar.png"} 
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
            
            <div>
              <h3 className="font-bold text-white hover:neon-text cursor-pointer transition-all">
                {post.author.displayName || post.author.username}
              </h3>
              <p className="text-sm text-gray-400">
                @{post.author.username} • {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          <NeonButton variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </NeonButton>
        </div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-white text-lg leading-relaxed">
            {post.content}
          </p>
        </motion.div>

        {/* Media Content */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden">
            {post.media.map((media, index) => (
              <motion.div
                key={index}
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Post media"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-auto max-h-96"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                liked 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-pink-400'
              }`}
            >
              <motion.div
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
              </motion.div>
              <span className="font-medium">
                {post.likes + (liked ? 1 : 0)}
              </span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-blue-400 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments}</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onShare?.(post)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-green-400 transition-all duration-300"
            >
              <Share className="w-5 h-5" />
              <span className="font-medium">{post.shares || 0}</span>
            </motion.button>
          </div>

          {/* Mood indicator */}
          {post.mood && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
              post.mood.vibe === 'fire' ? 'from-red-500 to-orange-500' :
              post.mood.vibe === 'chill' ? 'from-blue-500 to-cyan-500' :
              post.mood.vibe === 'chaos' ? 'from-yellow-400 to-purple-600' :
              'from-purple-500 to-pink-500'
            }`}>
              {post.mood.vibe} vibes ✨
            </div>
          )}
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Sample comments */}
                {[
                  { user: 'jane_doe', content: 'This is fire! 🔥', time: '2m' },
                  { user: 'cool_user', content: 'Vibing with this energy ✨', time: '5m' }
                ].map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-white">@{comment.user}</span>
                        <span className="text-gray-300 ml-2">{comment.content}</span>
                      </p>
                      <p className="text-xs text-gray-500">{comment.time} ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="mt-4 flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Add a vibe..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <NeonButton size="sm">Post</NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}

export default PostCard
