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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black neon-text flex items-center justify-center">
          Your Feed ✨
        </h2>
        <p className="text-gray-400 mt-2">What's vibing in your universe</p>
      </div>

      <StoryBar />

      <CreatePost onPostCreate={(data) => createMutation.mutate(data)} />

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
