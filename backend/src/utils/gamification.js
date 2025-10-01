const User = require('../models/User')
const { calculateLevelFromXP } = require('./helpers')

// XP values for different actions
const XP_VALUES = {
  REGISTER: 50,
  FIRST_POST: 25,
  POST: 10,
  LIKE_RECEIVED: 5,
  COMMENT_RECEIVED: 8,
  MESSAGE_SENT: 2,
  CONNECTION_MADE: 15,
  PROFILE_COMPLETE: 30,
  DAILY_LOGIN: 5,
  ACHIEVEMENT_UNLOCK: 20
}

// Achievement definitions
const ACHIEVEMENTS = {
  WELCOME: {
    id: 'welcome',
    name: 'Welcome to Hushh',
    description: 'Join the Hushh community',
    emoji: '🎉',
    xpReward: 50,
    condition: (user) => true // Auto-granted on registration
  },
  
  FIRST_POST: {
    id: 'first_post',
    name: 'First Vibe',
    description: 'Create your first post',
    emoji: '📝',
    xpReward: 25,
    condition: (user, data) => data.postCount >= 1
  },
  
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Make 10 connections',
    emoji: '🦋',
    xpReward: 100,
    condition: (user, data) => data.connectionCount >= 10
  },
  
  POPULAR_CREATOR: {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Get 100 likes on your posts',
    emoji: '⭐',
    xpReward: 150,
    condition: (user, data) => data.totalLikes >= 100
  },
  
  VIBE_MASTER: {
    id: 'vibe_master',
    name: 'Vibe Master',
    description: 'Reach level 10',
    emoji: '🔥',
    xpReward: 200,
    condition: (user) => user.gamification.level >= 10
  },
  
  CHATTY: {
    id: 'chatty',
    name: 'Chatty',
    description: 'Send 100 messages',
    emoji: '💬',
    xpReward: 75,
    condition: (user, data) => data.messageCount >= 100
  },
  
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Login at 6 AM',
    emoji: '🌅',
    xpReward: 50,
    condition: (user, data) => data.loginHour === 6
  },
  
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Post after midnight',
    emoji: '🦉',
    xpReward: 30,
    condition: (user, data) => data.postHour >= 0 && data.postHour <= 5
  },
  
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    description: '7-day login streak',
    emoji: '🎯',
    xpReward: 100,
    condition: (user, data) => data.loginStreak >= 7
  },
  
  TRENDSETTER: {
    id: 'trendsetter',
    name: 'Trendsetter',
    description: 'Create a viral post (50+ likes)',
    emoji: '📈',
    xpReward: 125,
    condition: (user, data) => data.maxPostLikes >= 50
  }
}

// Award XP to user
const awardXP = async (userId, action, amount = null) => {
  try {
    const xpAmount = amount || XP_VALUES[action] || 0
    
    if (xpAmount <= 0) return null
    
    const user = await User.findById(userId)
    if (!user) return null
    
    const oldXP = user.gamification.xp
    const newXP = oldXP + xpAmount
    
    // Calculate level progression
    const oldLevel = calculateLevelFromXP(oldXP).level
    const newLevel = calculateLevelFromXP(newXP).level
    
    // Update user
    user.gamification.xp = newXP
    user.gamification.level = newLevel
    
    // Check for level up
    let levelUpReward = null
    if (newLevel > oldLevel) {
      levelUpReward = {
        oldLevel,
        newLevel,
        bonusXP: newLevel * 10 // Bonus XP for leveling up
      }
      
      user.gamification.xp += levelUpReward.bonusXP
    }
    
    await user.save()
    
    return {
      xpAwarded: xpAmount,
      totalXP: user.gamification.xp,
      level: user.gamification.level,
      levelUp: levelUpReward
    }
    
  } catch (error) {
    console.error('Award XP error:', error)
    return null
  }
}

// Check and unlock achievements
const checkAchievements = async (userId, data = {}) => {
  try {
    const user = await User.findById(userId)
    if (!user) return []
    
    const unlockedAchievements = []
    const userAchievements = user.gamification.achievements.map(a => a.id) || []
    
    // Check each achievement
    for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
      // Skip if already unlocked
      if (userAchievements.includes(achievementId)) continue
      
      // Check condition
      if (achievement.condition(user, data)) {
        // Unlock achievement
        user.gamification.achievements.push({
          id: achievementId,
          name: achievement.name,
          emoji: achievement.emoji,
          unlockedAt: new Date()
        })
        
        // Award XP
        user.gamification.xp += achievement.xpReward
        
        unlockedAchievements.push({
          ...achievement,
          xpReward: achievement.xpReward
        })
      }
    }
    
    if (unlockedAchievements.length > 0) {
      // Recalculate level after achievement XP
      const levelData = calculateLevelFromXP(user.gamification.xp)
      user.gamification.level = levelData.level
      
      await user.save()
    }
    
    return unlockedAchievements
    
  } catch (error) {
    console.error('Check achievements error:', error)
    return []
  }
}

// Get user rank/leaderboard position
const getUserRank = async (userId) => {
  try {
    const rank = await User.countDocuments({
      'gamification.xp': { $gt: (await User.findById(userId))?.gamification?.xp || 0 }
    })
    
    return rank + 1
    
  } catch (error) {
    console.error('Get user rank error:', error)
    return null
  }
}

// Get leaderboard
const getLeaderboard = async (limit = 10, type = 'xp') => {
  try {
    const sortField = type === 'level' ? 'gamification.level' : 'gamification.xp'
    
    const leaderboard = await User.find()
      .select('username profile gamification')
      .sort({ [sortField]: -1 })
      .limit(limit)
      .lean()
    
    return leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      displayName: user.profile?.displayName || user.username,
      avatar: user.profile?.avatar,
      xp: user.gamification.xp,
      level: user.gamification.level,
      achievements: user.gamification.achievements?.length || 0
    }))
    
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return []
  }
}

// Calculate daily bonus XP
const calculateDailyBonus = (loginStreak) => {
  const baseBonus = 5
  const streakMultiplier = Math.floor(loginStreak / 7) * 0.5 // +50% every 7 days
  
  return Math.floor(baseBonus * (1 + streakMultiplier))
}

// Get user gamification stats
const getUserGamificationStats = async (userId) => {
  try {
    const user = await User.findById(userId).select('gamification')
    if (!user) return null
    
    const levelData = calculateLevelFromXP(user.gamification.xp)
    const rank = await getUserRank(userId)
    
    return {
      xp: user.gamification.xp,
      level: user.gamification.level,
      levelProgress: levelData,
      rank,
      achievements: user.gamification.achievements || [],
      totalAchievements: Object.keys(ACHIEVEMENTS).length,
      badges: user.gamification.badges || []
    }
    
  } catch (error) {
    console.error('Get gamification stats error:', error)
    return null
  }
}

// Award badge
const awardBadge = async (userId, badgeId, badgeName) => {
  try {
    const user = await User.findById(userId)
    if (!user) return false
    
    // Check if badge already exists
    if (user.gamification.badges && user.gamification.badges.includes(badgeId)) {
      return false
    }
    
    // Add badge
    if (!user.gamification.badges) {
      user.gamification.badges = []
    }
    
    user.gamification.badges.push(badgeId)
    await user.save()
    
    return true
    
  } catch (error) {
    console.error('Award badge error:', error)
    return false
  }
}

module.exports = {
  XP_VALUES,
  ACHIEVEMENTS,
  awardXP,
  checkAchievements,
  getUserRank,
  getLeaderboard,
  calculateDailyBonus,
  getUserGamificationStats,
  awardBadge
}
