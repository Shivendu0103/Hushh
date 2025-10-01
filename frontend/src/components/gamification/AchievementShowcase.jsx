import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Heart, MessageCircle, Crown } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const AchievementShowcase = ({ achievements = [] }) => {
  const achievementIcons = {
    'Welcome to Hushh': <Star className="w-6 h-6" />,
    'First Post': <MessageCircle className="w-6 h-6" />,
    'Popular Creator': <Heart className="w-6 h-6" />,
    'Vibe Master': <Zap className="w-6 h-6" />,
    'Social Butterfly': <Trophy className="w-6 h-6" />,
    'Chaos Lord': <Crown className="w-6 h-6" />
  }

  const achievementColors = {
    'Welcome to Hushh': 'from-blue-500 to-cyan-500',
    'First Post': 'from-green-500 to-emerald-500',
    'Popular Creator': 'from-pink-500 to-rose-500',
    'Vibe Master': 'from-purple-500 to-violet-500',
    'Social Butterfly': 'from-yellow-500 to-orange-500',
    'Chaos Lord': 'from-red-500 to-pink-500'
  }

  if (achievements.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No achievements yet. Start your journey!</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold neon-text mb-4 flex items-center">
        <Trophy className="w-6 h-6 mr-2" />
        Achievements ({achievements.length})
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`glass p-4 rounded-xl bg-gradient-to-br ${
              achievementColors[achievement.name] || 'from-purple-500/20 to-pink-500/20'
            } hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer`}
          >
            <div className="text-center">
              <div className="text-yellow-400 mb-2 flex justify-center">
                {achievementIcons[achievement.name] || <Star className="w-6 h-6" />}
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">
                {achievement.name}
              </h4>
              <p className="text-gray-300 text-xs mb-2">
                {achievement.emoji}
              </p>
              {achievement.unlockedAt && (
                <p className="text-gray-400 text-xs">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

export default AchievementShowcase
