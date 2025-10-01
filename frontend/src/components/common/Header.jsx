import { motion } from 'framer-motion'
import { Home, MessageCircle, User, Settings, LogOut, Bell, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import NeonButton from '../ui/NeonButton'
import SearchModal from './SearchModal'
import NotificationPanel from './NotificationPanel'

const Header = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [notifications] = useState(3) // Unread count
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass backdrop-blur-lg border-b border-white/10 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.h1
                className="text-2xl font-black neon-text"
                whileHover={{ scale: 1.05 }}
              >
                Hushh ✨
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.path === '/messages' && notifications > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {notifications}
                      </motion.span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <NeonButton 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-5 h-5" />
              </NeonButton>

              {/* Notifications */}
              <div className="relative">
                <NeonButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="w-5 h-5" />
                </NeonButton>
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </motion.span>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                    <img
                      src={user?.profile?.avatar || "/default-avatar.png"}
                      alt={user?.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="hidden lg:block font-medium text-white">
                    {user?.profile?.displayName || user?.username}
                  </span>
                </Link>

                <NeonButton variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass backdrop-blur-lg border-t border-white/10 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all relative ${
                  isActive ? 'text-purple-400' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.path === '/messages' && notifications > 0 && (
                  <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  )
}

export default Header
