import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, MessageCircle, Zap } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [followStatus, setFollowStatus] = useState({})
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Search users query
  const { data: searchResults = [], isLoading } = useQuery(
    ['searchUsers', searchQuery],
    async () => {
      if (!searchQuery.trim()) return []
      const res = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`)
      return res.data || res
    },
    {
      staleTime: 5000,
      retry: 1
    }
  )

  // Follow mutation
  const followMutation = useMutation(
    async (userId) => {
      const res = await api.post(`/users/${userId}/follow`)
      return res
    },
    {
      onSuccess: (data, userId) => {
        setFollowStatus(prev => ({ ...prev, [userId]: !prev[userId] }))
        toast.success('User followed!')
        queryClient.invalidateQueries('searchUsers')
      },
      onError: () => toast.error('Failed to follow user')
    }
  )

  // Get trending users
  const { data: trendingUsers = [] } = useQuery(
    'trendingUsers',
    async () => {
      const res = await api.get('/users/trending')
      return res.data || res
    },
    {
      staleTime: 30000
    }
  )

  const displayResults = searchQuery.trim() ? searchResults : trendingUsers

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Discover People
        </h1>
        <p className="text-gray-400 text-lg">
          {searchQuery ? 'Search results' : 'Explore trending creators'}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Grid */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </motion.div>
      ) : displayResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {displayResults.map((person, index) => (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="group relative h-full">
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl p-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Card Content */}
                  <div className="relative h-full bg-black/40 backdrop-blur-xl border border-white/10 group-hover:border-white/20 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                    {/* Background Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />

                    <div className="relative space-y-4">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-24 mx-auto"
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                          <img
                            src={person.profile?.avatar || `https://ui-avatars.com/api/?name=${person.username}&background=random&size=96`}
                            alt={person.username}
                            onClick={() => navigate(`/profile/${person._id}`)}
                            className="w-full h-full rounded-full object-cover cursor-pointer"
                          />
                        </div>
                      </motion.div>

                      {/* User Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">{person.profile?.displayName || person.username}</h3>
                        <p className="text-sm text-purple-300">@{person.username}</p>
                        {person.profile?.bio && (
                          <p className="text-sm text-gray-400 line-clamp-2">{person.profile.bio}</p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex justify-around pt-2">
                        <div className="text-center">
                          <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
                            {person.stats?.followers || 0}
                          </p>
                          <p className="text-xs text-gray-400">followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                            {person.stats?.posts || 0}
                          </p>
                          <p className="text-xs text-gray-400">posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
                            {person.gamification?.level || 1}
                          </p>
                          <p className="text-xs text-gray-400">level</p>
                        </div>
                      </div>

                      {/* Level Badge */}
                      {person.gamification?.level && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-200">Level {person.gamification.level}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {user?._id !== person._id && (
                      <div className="relative flex gap-3 pt-4 border-t border-white/10">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => followMutation.mutate(person._id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            followStatus[person._id]
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                          }`}
                        >
                          <UserPlus className="w-4 h-4" />
                          {followStatus[person._id] ? 'Following' : 'Follow'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/messages/${person._id}`)}
                          className="flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10 transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}

                    {user?._id === person._id && (
                      <div className="text-center text-sm text-gray-400 pt-4 border-t border-white/10">
                        That's you!
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No users found' : 'No trending users'}
          </h3>
          <p className="text-gray-400">
            {searchQuery
              ? 'Try searching with a different name'
              : 'Check back soon for trending creators'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Explore
