import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Palette, Music, Zap, User, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import LiquidBackground from '../components/ui/LiquidBackground'

const Settings = () => {
  const { user } = useAuth()
  const { appearance, updateAppearance } = useTheme()
  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      comments: true,
      messages: true,
      achievements: true
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowMessages: true
    }
  })

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleThemeChange = (newTheme) => {
    updateAppearance('theme', newTheme)
  }

  const handleChaosMode = (value) => {
    updateAppearance('chaosMode', value)
  }

  const handleAnimations = (value) => {
    updateAppearance('animations', value)
  }

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-white">{label}</span>
      <motion.button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full p-1 transition-all ${
          enabled ? 'bg-purple-500' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          className="w-4 h-4 bg-white rounded-full"
        />
      </motion.button>
    </div>
  )

  const SettingsSection = ({ icon: Icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-cyan-500/50 rounded-2xl p-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 group-hover:border-white/20 rounded-2xl p-8 transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="relative space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-400 text-lg">Customize your Hushh experience</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Section */}
        <SettingsSection icon={User} title="Account">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Current Email</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Username</p>
              <p className="text-white font-medium">@{user?.username}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all font-medium"
            >
              Logout
            </motion.button>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection icon={Bell} title="Notifications">
          <ToggleSwitch
            enabled={settings.notifications.likes}
            onChange={(val) => updateSetting('notifications', 'likes', val)}
            label="Likes & Reactions"
          />
          <ToggleSwitch
            enabled={settings.notifications.comments}
            onChange={(val) => updateSetting('notifications', 'comments', val)}
            label="Comments"
          />
          <ToggleSwitch
            enabled={settings.notifications.messages}
            onChange={(val) => updateSetting('notifications', 'messages', val)}
            label="Direct Messages"
          />
          <ToggleSwitch
            enabled={settings.notifications.achievements}
            onChange={(val) => updateSetting('notifications', 'achievements', val)}
            label="Achievements"
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection icon={Palette} title="Appearance">
          <ToggleSwitch
            enabled={appearance.chaosMode}
            onChange={handleChaosMode}
            label="Chaos Mode"
          />
          <ToggleSwitch
            enabled={appearance.animations}
            onChange={handleAnimations}
            label="Animations"
          />
          <div>
            <label className="text-white block mb-3 font-medium text-sm">Theme</label>
            <div className="flex gap-2">
              {['dark', 'neon', 'cosmic'].map((themeOption) => (
                <motion.button
                  key={themeOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    appearance.theme === themeOption
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {themeOption === 'dark' && '🌙'}
                  {themeOption === 'neon' && '⚡'}
                  {themeOption === 'cosmic' && '🌌'}
                  {' ' + themeOption}
                </motion.button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection icon={Shield} title="Privacy & Security">
          <ToggleSwitch
            enabled={settings.privacy.profileVisible}
            onChange={(val) => updateSetting('privacy', 'profileVisible', val)}
            label="Public Profile"
          />
          <ToggleSwitch
            enabled={settings.privacy.showOnlineStatus}
            onChange={(val) => updateSetting('privacy', 'showOnlineStatus', val)}
            label="Show Online Status"
          />
          <ToggleSwitch
            enabled={settings.privacy.allowMessages}
            onChange={(val) => updateSetting('privacy', 'allowMessages', val)}
            label="Allow Direct Messages"
          />
        </SettingsSection>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <Zap className="w-5 h-5" />
          Save Settings
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Settings
