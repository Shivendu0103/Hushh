import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import PostCard from './PostCard'
import StoryBar from '../stories/StoryBar'

const API_URL = import.meta.env.VITE_API_URL

const PostFeed = () => {
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading } = useQuery('posts', async () => {
    const res = await axios.get(`${API_URL}/posts`, { withCredentials: true })
    return res.data.posts
  })

  const likeMutation = useMutation(
    async (postId) => {
      const res = await axios.post(`${API_URL}/posts/${postId}/like`, {}, { withCredentials: true })
      return res.data
    },
    {
      onSuccess: () => queryClient.invalidateQueries('posts'),
      onError: () => toast.error('Failed to like post')
    }
  )

  const commentMutation = useMutation(
    async ({ postId, content }) => {
      const res = await axios.post(`${API_URL}/posts/${postId}/comment`, { content }, { withCredentials: true })
      return res.data
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
      const res = await axios.post(`${API_URL}/posts/${postId}/share`, {}, { withCredentials: true })
      return res.data
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
      const res = await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true })
      return res.data
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black neon-text flex items-center justify-center">
          Your Feed ✨
        </h2>
        <p className="text-gray-400 mt-2">What's vibing in your universe</p>
      </div>

      <StoryBar />

      {isLoading ? (
        <div className="text-center text-gray-400">Loading vibes...</div>
      ) : posts.length > 0 ? (
        posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <PostCard
              post={post}
              onLike={(id) => likeMutation.mutate(id)}
              onComment={(id, content) => commentMutation.mutate({ postId: id, content })}
              onShare={(id) => shareMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </motion.div>
        ))
      ) : (
        <div className="text-center text-gray-400">No posts yet. Be the first to share your vibe!</div>
      )}
    </div>
  )
}

export default PostFeed
