import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../utils/api'
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
    <div className="min-h-screen relative">
      <LiquidBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <ProfileHeader 
            user={profileData}
            isOwn={isOwn}
            onEditProfile={() => setIsEditing(true)}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Posts', value: profileData?.stats?.posts || 0, icon: '📝', color: 'from-blue-500 to-cyan-500' },
              { label: 'Vibers', value: profileData?.stats?.followers || 0, icon: '👥', color: 'from-purple-500 to-pink-500' },
              { label: 'Vibing', value: profileData?.stats?.following || 0, icon: '🤝', color: 'from-green-500 to-emerald-500' },
              { label: 'Level', value: profileData?.gamification?.level || 1, icon: '🏆', color: 'from-yellow-500 to-orange-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className={`p-4 text-center bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold neon-text">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </GlassCard>
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
                  />
                ))}
              </div>
            ) : (
                <div className="text-gray-500">No signals found in this sector yet.</div>
            )}
          </div>
        </motion.div>
      </div>

      <EditProfileModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        user={profileData} 
      />
    </div>
  )
}

export default Profile
