import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../utils/api'
import toast from 'react-hot-toast'
import ProfileHeader from '../components/profile/ProfileHeader'
import EditProfileModal from '../components/profile/EditProfileModal'
import AchievementShowcase from '../components/gamification/AchievementShowcase'
import PostCard from '../components/posts/PostCard'
import LiquidBackground from '../components/ui/LiquidBackground'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { Edit, Music, Settings } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const { id } = useParams()
  const targetUserId = id || user?.id
  const queryClient = useQueryClient()

  const { data: profileData, isLoading: profileLoading } = useQuery(
    ['user', targetUserId], 
    async () => {
      const res = await api.get(`/users/${targetUserId}`)
      return res.user
    },
    { enabled: !!targetUserId }
  )

  const { data: userPosts = [], isLoading: postsLoading } = useQuery(
    ['posts', targetUserId], 
    async () => {
      const res = await api.get(`/posts?author=${targetUserId}`)
      return res.posts
    },
    { enabled: !!targetUserId }
  )

  const likeMutation = useMutation(
    async (postId) => {
      const res = await api.post(`/posts/${postId}/like`)
      return res
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['posts', targetUserId]),
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
        queryClient.invalidateQueries(['posts', targetUserId])
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
        queryClient.invalidateQueries(['posts', targetUserId])
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
        queryClient.invalidateQueries(['posts', targetUserId])
        toast.success('Post deleted')
      },
      onError: () => toast.error('Failed to delete post')
    }
  )

  if (profileLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <LiquidBackground />
        <div className="relative z-10 text-white text-xl">Loading Profile Views...</div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <LiquidBackground />
        <div className="relative z-10 text-white text-xl">User not found dimension.</div>
      </div>
    )
  }

  const isOwn = !id || id === user?.id

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Cover & Avatar */}
      <div className="relative h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-black/30" />
        {profileData.profile?.coverImage && (
          <img
            src={profileData.profile.coverImage}
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
              src={profileData.profile?.avatar || `https://ui-avatars.com/api/?name=${profileData.username}&size=160&background=random`}
              alt={profileData.username}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="mt-24 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">{profileData.profile?.displayName || profileData.username}</h1>
            <p className="text-lg text-purple-300">@{profileData.username}</p>
            {profileData.profile?.bio && (
              <p className="text-gray-300 mt-2 max-w-2xl">{profileData.profile.bio}</p>
            )}
          </div>

          {isOwn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Posts', value: profileData?.stats?.posts || 0, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Followers', value: profileData?.stats?.followers || 0, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Following', value: profileData?.stats?.following || 0, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Level', value: profileData?.gamification?.level || 1, gradient: 'from-yellow-500 to-orange-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className={`h-full bg-white/5 border border-white/10 group-hover:border-white/20 rounded-xl p-4 text-center hover:shadow-lg transition-all`}>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <AchievementShowcase achievements={profileData?.gamification?.achievements || []} />

        {/* Recent Posts */}
        <div>
          <h3 className="text-2xl font-bold neon-text mb-6 flex items-center">
            <Edit className="w-6 h-6 mr-2" />
            {isOwn ? 'Your Posts' : `${profileData?.profile?.displayName || profileData.username}'s Posts`}
          </h3>
          
          {postsLoading ? (
            <div className="text-gray-400">Loading posts matrix...</div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                  onComment={(id, content) => commentMutation.mutate({ postId: id, content })}
                  onShare={(id) => shareMutation.mutate(id)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
              <div className="text-gray-500">No signals found in this sector yet.</div>
          )}
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        user={profileData} 
      />
    </motion.div>
  )
}

export default Profile
