import { motion } from 'framer-motion'
import { Edit, Music, Settings, Zap, Camera } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import StatusBanner from './StatusBanner'

const ProfileHeader = ({ user, isOwn = false, onEditProfile }) => {
  const [chaosMode, setChaosMode] = useState(user?.preferences?.chaosMode || false)

  return (
    <div className="relative">
      {/* Cover Image with Parallax Effect */}
      <motion.div
        className="h-64 md:h-80 rounded-3xl overflow-hidden relative"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={`
          absolute inset-0 bg-gradient-to-br 
          ${chaosMode 
            ? 'from-yellow-400 via-red-500 to-purple-600 animate-gradient bg-[length:400%_400%]'
            : 'from-purple-600 via-pink-500 to-cyan-500'
          }
        `} />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Cover Actions */}
        {isOwn && (
          <div className="absolute top-4 right-4">
            <NeonButton size="sm" variant="ghost">
              <Camera className="w-4 h-4" />
            </NeonButton>
          </div>
        )}
      </motion.div>

      {/* Profile Info Card */}
      <div className="relative -mt-32 px-6">
        <GlassCard className="p-6" variant="neon">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <img
                  src={user?.profile?.avatar || "/default-avatar.png"}
                  alt={user?.profile?.displayName || user?.username}
                  className="w-full h-full rounded-full object-cover border-4 border-black/20"
                />
              </div>
              
              {/* Online indicator */}
              {user?.isOnline && (
                <motion.div
                  className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black neon-text mb-2">
                {user?.profile?.displayName || user?.username}
              </h1>
              <p className="text-gray-400 text-lg">@{user?.username}</p>
              
              {user?.profile?.bio && (
                <p className="text-white/80 mt-2 text-sm md:text-base max-w-md">
                  {user.profile.bio}
                </p>
              )}

              {/* Status Banner */}
              <div className="mt-4">
                <StatusBanner
                  status={user?.profile?.currentVibe?.status || '🌌 Lost in thoughts'}
                  emoji={user?.profile?.currentVibe?.emoji || '🌌'}
                  color={user?.profile?.currentVibe?.color || '#8338ec'}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              {isOwn ? (
                <>
                  <NeonButton onClick={onEditProfile} size="sm" icon={<Edit />}>
                    Edit Profile
                  </NeonButton>
                  <NeonButton
                    variant={chaosMode ? "chaos" : "secondary"}
                    size="sm"
                    icon={<Zap />}
                    onClick={() => setChaosMode(!chaosMode)}
                  >
                    {chaosMode ? "Exit Chaos" : "Chaos Mode"}
                  </NeonButton>
                </>
              ) : (
                <>
                  <NeonButton size="sm">Follow</NeonButton>
                  <NeonButton variant="secondary" size="sm">Message</NeonButton>
                </>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center md:justify-start space-x-8 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Posts', value: user?.stats?.posts || 0 },
              { label: 'Vibing', value: user?.stats?.following || 0 },
              { label: 'Vibers', value: user?.stats?.followers || 0 },
              { label: 'Level', value: user?.gamification?.level || 1 },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-xl md:text-2xl font-bold neon-text">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Level {user?.gamification?.level || 1}</span>
              <span>{user?.gamification?.xp || 0} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((user?.gamification?.xp || 0) % 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Music Player (if theme song exists) */}
          {user?.profile?.themeSong && (
            <motion.div
              className="mt-4 glass p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-purple-400" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    {user.profile.themeSong.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    by {user.profile.themeSong.artist}
                  </p>
                </div>
                <NeonButton size="sm" variant="ghost">
                  ▶️
                </NeonButton>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default ProfileHeader
