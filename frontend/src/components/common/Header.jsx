import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Bell } from 'lucide-react'
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
    <div className="flex items-center space-x-2 relative z-20">
      {/* Notification Bell */}
      <div className="relative">
        <button className="p-2 rounded-full hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-white" />
        </button>
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {notifications}
          </span>
        )}
      </div>

      {/* Avatar + Name */}
      <Link to="/profile" className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-white/10 transition-all">
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5 shrink-0">
          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <span className="hidden lg:block text-sm font-medium text-white">
          {user?.profile?.displayName || user?.username}
        </span>
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center space-x-1"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden lg:inline">Logout</span>
      </button>
    </div>
  )

  return (
    <>
      <Navbar>
        {/* Desktop */}
        <NavBody>
          {/* Logo */}
          <Link to="/" className="relative z-20 flex items-center space-x-2 px-2 py-1 shrink-0">
            <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
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
            <Link to="/" className="flex items-center">
              <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Hushh ✨
              </span>
            </Link>
            <div className="flex items-center space-x-3">
              {/* Bell on mobile header */}
              <div className="relative">
                <Bell className="w-5 h-5 text-white" />
                {notifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </div>
              <MobileNavToggle
                isOpen={isMobileOpen}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)}>
            {navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center w-full py-2 px-3 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-all font-medium"
              >
                {item.name}
              </Link>
            ))}

            <div className="w-full pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {user?.profile?.displayName || user?.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full border border-white/20 text-white text-sm flex items-center space-x-1 hover:bg-white/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-20" />
    </>
  )
}

export default Header
