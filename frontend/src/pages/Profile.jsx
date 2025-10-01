import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ProfileHeader from '../components/profile/ProfileHeader'
import AchievementShowcase from '../components/gamification/AchievementShowcase'
import PostCard from '../components/posts/PostCard'
import LiquidBackground from '../components/ui/LiquidBackground'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { Edit, Music, Settings } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Sample user posts
  const userPosts = [
    {
      id: 1,
      author: {
        username: user?.username || 'you',
        displayName: user?.profile?.displayName || user?.username || 'You',
        avatar: user?.profile?.avatar || '/default-avatar.png'
      },
      content: "Just launched my epic social media platform Hushh! 🔥✨ The glassmorphism effects are absolutely insane!",
      media: [],
      likes: 25,
      comments: 8,
      shares: 3,
      mood: { name: 'fire', emoji: '🔥', color: 'from-red-500 to-orange-500', label: 'On Fire' },
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]

  const userStats = {
    posts: userPosts.length,
    following: 42,
    followers: 128,
    ...user?.stats
  }

  const userWithStats = {
    ...user,
    stats: userStats
  }

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
            user={userWithStats}
            isOwn={true}
            onEditProfile={() => setIsEditing(true)}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Posts', value: userStats.posts, icon: '📝', color: 'from-blue-500 to-cyan-500' },
              { label: 'Vibers', value: userStats.followers, icon: '👥', color: 'from-purple-500 to-pink-500' },
              { label: 'Vibing', value: userStats.following, icon: '🤝', color: 'from-green-500 to-emerald-500' },
              { label: 'Level', value: user?.gamification?.level || 1, icon: '🏆', color: 'from-yellow-500 to-orange-500' }
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
          <AchievementShowcase achievements={user?.gamification?.achievements || []} />

          {/* Recent Posts */}
          <div>
            <h3 className="text-2xl font-bold neon-text mb-6 flex items-center">
              <Edit className="w-6 h-6 mr-2" />
              Your Posts
            </h3>
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onComment={() => {}}
                  onShare={() => {}}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
