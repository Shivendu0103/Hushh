import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import GlassCard from '../ui/GlassCard'
import { RefreshCw, TrendingUp } from 'lucide-react'

const PostFeed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  // Sample posts data
  const samplePosts = [
    {
      id: 1,
      author: {
        username: 'vibe_master',
        displayName: 'Vibe Master',
        avatar: '/default-avatar.png'
      },
      content: "Just dropped the most fire beat! The energy is unmatched 🔥🎵 Who else is feeling this vibe tonight?",
      media: [],
      likes: 42,
      comments: 8,
      shares: 5,
      mood: { name: 'fire', emoji: '🔥', color: 'from-red-500 to-orange-500', label: 'On Fire' },
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 2,
      author: {
        username: 'cosmic_dreamer',
        displayName: 'Cosmic Dreamer',
        avatar: '/default-avatar.png'
      },
      content: "Lost in the stars tonight... anyone else feeling this cosmic energy? The universe is calling 🌌✨",
      media: [],
      likes: 28,
      comments: 12,
      shares: 3,
      mood: { name: 'cosmic', emoji: '🌌', color: 'from-indigo-500 to-purple-600', label: 'Cosmic' },
      createdAt: new Date(Date.now() - 45 * 60 * 1000)
    }
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setPosts(samplePosts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setPosts([...samplePosts].sort(() => Math.random() - 0.5))
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Feed Header with Trending */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black neon-text flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            Your Feed ✨
          </h2>
          <p className="text-gray-400 mt-1">What's vibing in your universe</p>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          disabled={loading}
          className="glass p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreate={handleCreatePost} />

      {/* Posts */}
      {loading && posts.length === 0 ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-32" />
                    <div className="h-3 bg-white/10 rounded w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <motion.div layout className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <PostCard 
                post={post} 
                onLike={handleLike}
                onComment={(postId) => console.log('Comment on', postId)}
                onShare={(post) => console.log('Share', post)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Load More */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass px-8 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 neon-gradient"
        >
          Load more vibes 🚀
        </motion.button>
      </div>
    </div>
  )
}

export default PostFeed
