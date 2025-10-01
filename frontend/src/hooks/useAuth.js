import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return {
    ...context,
    // Additional helper methods
    isLoggedIn: context.isAuthenticated,
    userLevel: context.user?.gamification?.level || 1,
    userXP: context.user?.gamification?.xp || 0,
    isOnline: context.user?.isOnline || false,
    
    // Quick access methods
    getUserId: () => context.user?.id,
    getUsername: () => context.user?.username,
    getDisplayName: () => context.user?.profile?.displayName || context.user?.username,
    getAvatar: () => context.user?.profile?.avatar,
    
    // Permission checks
    canPost: () => context.isAuthenticated,
    canMessage: () => context.isAuthenticated,
    canConnect: (targetUserId) => context.isAuthenticated && context.user?.id !== targetUserId,
    
    // Profile completion check
    isProfileComplete: () => {
      if (!context.user) return false
      const profile = context.user.profile
      return !!(profile?.displayName && profile?.bio && profile?.avatar)
    }
  }
}

export default useAuth
