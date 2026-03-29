import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, MessageCircle, User, Settings, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from '../ui/resizable-navbar'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [notifications] = useState(3)

  const navItems = [
    { name: 'Feed', link: '/' },
    { name: 'Messages', link: '/messages' },
    { name: 'Profile', link: '/profile' },
    { name: 'Settings', link: '/settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const UserSection = () => (
    <div className="flex items-center space-x-3">
      {/* Notification Bell */}
      <div className="relative">
        <button className="p-2 rounded-full hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </div>

      {/* Avatar + Name */}
      <Link to="/profile" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="hidden lg:block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {user?.profile?.displayName || user?.username}
        </span>
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="p-2 rounded-full hover:bg-red-500/20 transition-all"
        title="Logout"
      >
        <LogOut className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
      </button>
    </div>
  )

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        {/* Logo */}
        <Link to="/" className="relative z-20 flex items-center space-x-2 px-2 py-1">
          <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Hushh ✨
          </span>
        </Link>

        {/* Nav Links */}
        <NavItems items={navItems} onItemClick={() => {}} />

        {/* Right section */}
        <UserSection />
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Hushh ✨
            </span>
          </Link>
          <MobileNavToggle
            isOpen={isMobileOpen}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)}>
          {navItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center space-x-3 w-full py-2 px-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}

          <div className="w-full pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <Link to="/profile" className="flex items-center space-x-2" onClick={() => setIsMobileOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {user?.profile?.displayName || user?.username}
                </span>
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-500/20 transition-all">
                <LogOut className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}

export default Header
