import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Heart, MessageCircle, Share, UserPlus, MapPin, Cake, Zap, Trophy } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/posts/PostCard'

const PublicProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(false)

  // Fetch user profile
  const { data: profileUser, isLoading } = useQuery(
    ['publicProfile', userId],
    async () => {
      const res = await api.get(`/users/${userId}`)
      return res.data || res
    },
    { staleTime: 10000 }
  )

  // Fetch user posts
  const { data: userPosts = [] } = useQuery(
    ['userPosts', userId],
    async () => {
      const res = await api.get(`/users/${userId}/posts`)
      return res.data || res
    },
    { staleTime: 5000 }
  )

  // Follow mutation
  const followMutation = useMutation(
    async () => {
      const res = await api.post(`/users/${userId}/follow`)
      return res
    },
    {
      onSuccess: () => {
        setIsFollowing(!isFollowing)
        toast.success(isFollowing ? 'Unfollowed!' : 'Followed!')
      },
      onError: () => toast.error('Failed to update follow status')
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          <div className="h-12 bg-white/5 rounded-xl w-1/3 animate-pulse" />
          <div className="h-6 bg-white/5 rounded-lg w-1/2 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-xl font-bold text-white mb-2">User not found</h3>
        <p className="text-gray-400 mb-6">This user doesn't exist or has been deleted</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg"
        >
          Go Home
        </motion.button>
      </div>
    )
  }

  const isOwnProfile = currentUser?._id === profileUser._id

  return (
    <div className="space-y-8">
      {/* Cover Image & Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cover */}
        <div className="relative h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-black/30" />
          {profileUser.profile?.coverImage && (
            <img
              src={profileUser.profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}

          {/* Avatar Overlap */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-0 left-8 translate-y-1/2"
          >
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 p-1 shadow-2xl">
              <img
                src={profileUser.profile?.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&size=160&background=random`}
                alt={profileUser.username}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="mt-24 px-8 pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-4xl font-black text-white">{profileUser.profile?.displayName || profileUser.username}</h1>
                <p className="text-lg text-purple-300">@{profileUser.username}</p>
              </div>

              {/* Bio */}
              {profileUser.profile?.bio && (
                <p className="text-gray-300 max-w-2xl">{profileUser.profile.bio}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 pt-2">
                {profileUser.profile?.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{profileUser.profile.location}</span>
                  </div>
                )}
                {profileUser.profile?.dateOfBirth && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Cake className="w-4 h-4" />
                    <span>Born {new Date(profileUser.profile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => followMutation.mutate()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isFollowing
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/messages/${profileUser._id}`)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10 font-semibold transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Followers', value: profileUser.stats?.followers || 0, icon: null },
              { label: 'Following', value: profileUser.stats?.following || 0, icon: null },
              { label: 'Posts', value: profileUser.stats?.posts || 0, icon: null },
              { label: 'Level', value: profileUser.gamification?.level || 1, icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {stat.icon && <stat.icon className="w-5 h-5 text-purple-400" />}
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          {profileUser.gamification?.achievements && profileUser.gamification.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileUser.gamification.achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-4 text-center hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
                  >
                    <div className="text-3xl mb-2">{achievement.icon || '🏆'}</div>
                    <p className="font-semibold text-white text-sm">{achievement.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* User Posts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          Posts by {profileUser.profile?.displayName || profileUser.username}
        </h2>

        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400">
              {isOwnProfile ? "You haven't posted yet. Share your vibes!" : `${profileUser.profile?.displayName || profileUser.username} hasn't posted yet`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default PublicProfile
