import { useState, useEffect, useCallback } from 'react'
import { postsAPI } from '../utils/api'
import { useSocket } from './useSocket'
import { useAuth } from './useAuth'

const usePosts = (options = {}) => {
  const { userId, limit = 10, initialPosts = [] } = options
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const { useSocketListener } = useSocket()
  const { user } = useAuth()

  // Fetch posts
  const fetchPosts = useCallback(async (pageNum = 1, replace = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = { page: pageNum, limit }
      const response = userId 
        ? await postsAPI.getUserPosts(userId, params)
        : await postsAPI.getPosts(params)

      const newPosts = response.data.posts || []
      
      if (replace || pageNum === 1) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }

      setHasMore(response.data.pagination?.hasNext || false)
      setPage(pageNum)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }, [userId, limit])

  // Load more posts
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false)
    }
  }, [loading, hasMore, page, fetchPosts])

  // Refresh posts
  const refresh = useCallback(() => {
    fetchPosts(1, true)
  }, [fetchPosts])

  // Create new post
  const createPost = useCallback(async (postData) => {
    try {
      const response = await postsAPI.createPost(postData)
      const newPost = response.data.post

      // Add to local state immediately
      setPosts(prev => [newPost, ...prev])
      
      return { success: true, post: newPost }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create post'
      setError(message)
      return { success: false, error: message }
    }
  }, [])

  // Like/unlike post
  const toggleLike = useCallback(async (postId) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const wasLiked = post.likedByUser
          return {
            ...post,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
            likedByUser: !wasLiked
          }
        }
        return post
      }))

      const response = await postsAPI.likePost(postId)
      
      // Update with server response
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: response.data.likes,
            likedByUser: response.data.likedByUser
          }
        }
        return post
      }))

      return { success: true }
    } catch (err) {
      // Revert optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const wasLiked = post.likedByUser
          return {
            ...post,
            likes: wasLiked ? post.likes + 1 : post.likes - 1,
            likedByUser: !wasLiked
          }
        }
        return post
      }))

      return { success: false, error: err.response?.data?.message }
    }
  }, [])

  // Delete post
  const deletePost = useCallback(async (postId) => {
    try {
      await postsAPI.deletePost(postId)
      setPosts(prev => prev.filter(post => post.id !== postId))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }, [])

  // Real-time listeners
  useSocketListener('new_post', (newPost) => {
    // Only add if it's not from current user (they already have it)
    if (newPost.author.id !== user?.id) {
      setPosts(prev => [newPost, ...prev])
    }
  })

  useSocketListener('post_updated', (update) => {
    setPosts(prev => prev.map(post => {
      if (post.id === update.postId) {
        if (update.type === 'like') {
          return {
            ...post,
            likes: update.likes
          }
        }
      }
      return post
    }))
  })

  useSocketListener('post_deleted', (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  })

  // Initial fetch
  useEffect(() => {
    fetchPosts(1, true)
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    hasMore,
    page,
    fetchPosts,
    loadMore,
    refresh,
    createPost,
    toggleLike,
    deletePost
  }
}

export default usePosts
