import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MessageCircle, User, Trophy, Zap } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../ui/GlassCard'

const NotificationPanel = ({ isOpen, onClose, notifications = [] }) => {
  const [activeTab, setActiveTab] = useState('all')

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      type: 'like',
      user: { username: 'vibe_master', displayName: 'Vibe Master', avatar: '/default-avatar.png' },
      message: 'liked your post',
      content: 'Just dropped the most fire beat!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: { username: 'cosmic_dreamer', displayName: 'Cosmic Dreamer', avatar: '/default-avatar.png' },
      message: 'commented on your post',
      content: 'This is absolutely insane! 🔥',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: { username: 'chaos_queen', displayName: 'Chaos Queen', avatar: '/default-avatar.png' },
      message: 'started following you',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'achievement',
      message: 'You unlocked a new achievement!',
      content: 'Social Butterfly - Connect with 50 users',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false
    },
    {
      id: 5,
      type: 'message',
      user: { username: 'vibe_master', displayName: 'Vibe Master', avatar: '/default-avatar.png' },
      message: 'sent you a message',
      content: 'Yo! Check out this new beat...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ]

  const notificationIcons = {
    like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
    comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    follow: { icon: User, color: 'text-green-400', bg: 'bg-green-500/20' },
    message: { icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    achievement: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  }

  const tabs = [
    { id: 'all', label: 'All', count: sampleNotifications.length },
    { id: 'unread', label: 'Unread', count: sampleNotifications.filter(n => !n.read).length },
    { id: 'mentions', label: 'Mentions', count: 2 }
  ]

  const filteredNotifications = activeTab === 'unread' 
    ? sampleNotifications.filter(n => !n.read)
    : sampleNotifications

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const markAsRead = (notificationId) => {
    // In a real app, this would update the notification state
    console.log('Mark as read:', notificationId)
  }

  const markAllAsRead = () => {
    console.log('Mark all as read')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4"
          >
            <GlassCard className="p-0 overflow-hidden max-h-[70vh]">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold neon-text flex items-center">
                    🔔 Notifications
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No notifications yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      When you get notifications, they'll show up here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification, index) => {
                      const iconConfig = notificationIcons[notification.type]
                      const IconComponent = iconConfig.icon

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-white/5 cursor-pointer transition-all border-l-4 ${
                            notification.read 
                              ? 'border-transparent opacity-70' 
                              : 'border-purple-500 bg-purple-500/5'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`p-2 rounded-full ${iconConfig.bg} flex-shrink-0`}>
                              <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {notification.user && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                                      <img
                                        src={notification.user.avatar}
                                        alt={notification.user.displayName}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <span className="text-white font-medium text-sm">
                                    {notification.user?.displayName || 'Hushh'}
                                  </span>
                                </div>
                                <span className="text-gray-400 text-xs">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                              </div>

                              <p className="text-gray-300 text-sm mb-1">
                                {notification.message}
                              </p>

                              {notification.content && (
                                <p className="text-gray-400 text-sm truncate">
                                  "{notification.content}"
                                </p>
                              )}

                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel
