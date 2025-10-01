import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hushh_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hushh_token')
      localStorage.removeItem('hushh_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.patch('/users/profile', data),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  sendConnectionRequest: (userId) => api.post(`/users/connect/${userId}`),
  acceptConnection: (requestId) => api.patch(`/users/connect/${requestId}/accept`),
  declineConnection: (requestId) => api.patch(`/users/connect/${requestId}/decline`),
  getConnections: () => api.get('/users/connections'),
  getUserStats: (id) => api.get(`/users/${id}/stats`)
}

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  createPost: (data) => api.post('/posts', data),
  getUserPosts: (userId, params) => api.get(`/posts/user/${userId}`, { params }),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  commentPost: (postId, data) => api.post(`/posts/${postId}/comment`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`)
}

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages'),
  getMessages: (userId, params) => api.get(`/messages/${userId}`, { params }),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
  addReaction: (messageId, emoji) => api.post(`/messages/${messageId}/react`, { emoji }),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`)
}

// File upload API
export const uploadAPI = {
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadPostMedia: (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('media', file))
    return api.post('/upload/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadMessageMedia: (file) => {
    const formData = new FormData()
    formData.append('message', file)
    return api.post('/upload/message', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('hushh_token', token)
    api.defaults.headers.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('hushh_token')
    delete api.defaults.headers.Authorization
  }
}

export const getStoredToken = () => localStorage.getItem('hushh_token')
export const getStoredUser = () => {
  const user = localStorage.getItem('hushh_user')
  return user ? JSON.parse(user) : null
}

export default api
