import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import StoryBar from '../stories/StoryBar'


const PostFeed = () => {
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading } = useQuery('posts', async () => {
    const res = await api.get('/posts')
    return res.posts
  })

  const createMutation = useMutation(
    async (newPost) => {
      const res = await api.post('/posts', newPost)
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts')
        toast.success('Post created!')
      },
      onError: (err) => toast.error(err.message || 'Failed to create post')
    }
  )

  const likeMutation = useMutation(
    async (postId) => {
      const res = await api.post(`/posts/${postId}/like`)
      return res
    },
    {
      onSuccess: () => queryClient.invalidateQueries('posts'),
      onError: () => toast.error('Failed to like post')
    }
  )

  const commentMutation = useMutation(
    async ({ postId, content }) => {
      const res = await api.post(`/posts/${postId}/comment`, { content })
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts')
        toast.success('Comment added!')
      },
      onError: () => toast.error('Failed to add comment')
    }
  )

  const shareMutation = useMutation(
    async (postId) => {
      const res = await api.post(`/posts/${postId}/share`)
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts')
        toast.success('Post shared!')
      },
      onError: () => toast.error('Failed to share post')
    }
  )

  const deleteMutation = useMutation(
    async (postId) => {
      const res = await api.delete(`/posts/${postId}`)
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts')
        toast.success('Post deleted')
      },
      onError: () => toast.error('Failed to delete post')
    }
  )

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Your Vibe Feed
        </h1>
        <p className="text-gray-400 text-lg">Share your energy with the world ✨</p>
      </motion.div>

      {/* Stories Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StoryBar />
      </motion.div>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CreatePost onPostCreate={(data) => createMutation.mutate(data)} />
      </motion.div>

      {/* Posts Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block w-12 h-12 mb-4">
                <div className="w-full h-full rounded-full border-4 border-purple-500 border-t-cyan-500 animate-spin"></div>
              </div>
              <p className="text-gray-400">Loading your vibes...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="text-center text-sm text-gray-500 mb-4">
              {posts.length} post{posts.length !== 1 ? 's' : ''} in your feed
            </div>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                  onComment={(id, content) => commentMutation.mutate({ postId: id, content })}
                  onShare={(id) => shareMutation.mutate(id)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center max-w-sm">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400">Be the first to share your vibe and start the conversation!</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default PostFeed
