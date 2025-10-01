import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Palette, Music, Zap, User, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import LiquidBackground from '../components/ui/LiquidBackground'

const Settings = () => {
  const { user } = useAuth()
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
    },
    appearance: {
      theme: 'dark',
      chaosMode: false,
      animations: true,
      glassIntensity: 'medium'
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

  return (
    <div className="min-h-screen relative">
      <LiquidBackground chaosMode={settings.appearance.chaosMode} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black neon-text mb-2">Settings ⚙️</h1>
            <p className="text-gray-400">Customize your Hushh experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Notifications */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold neon-text mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-4">
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
                  label="Messages"
                />
                <ToggleSwitch
                  enabled={settings.notifications.achievements}
                  onChange={(val) => updateSetting('notifications', 'achievements', val)}
                  label="Achievements"
                />
              </div>
            </GlassCard>

            {/* Privacy */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold neon-text mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy
              </h3>
              <div className="space-y-4">
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
                  label="Allow Messages"
                />
              </div>
            </GlassCard>

            {/* Appearance */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold neon-text mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.appearance.chaosMode}
                  onChange={(val) => updateSetting('appearance', 'chaosMode', val)}
                  label="🌈 Chaos Mode"
                />
                <ToggleSwitch
                  enabled={settings.appearance.animations}
                  onChange={(val) => updateSetting('appearance', 'animations', val)}
                  label="✨ Animations"
                />
                
                {/* Theme Selector */}
                <div>
                  <label className="text-white block mb-2">Theme</label>
                  <div className="flex space-x-2">
                    {['dark', 'neon', 'cosmic'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSetting('appearance', 'theme', theme)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          settings.appearance.theme === theme
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {theme === 'dark' && '🌙'}
                        {theme === 'neon' && '⚡'}
                        {theme === 'cosmic' && '🌌'}
                        {' ' + theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Account */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold neon-text mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Username</label>
                  <p className="text-white font-medium">@{user?.username}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Email</label>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Member Since</label>
                  <p className="text-white font-medium">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="pt-4 space-y-2">
                  <NeonButton variant="secondary" size="sm" className="w-full">
                    Change Password
                  </NeonButton>
                  <NeonButton variant="danger" size="sm" className="w-full">
                    Delete Account
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Save Button */}
          <div className="text-center pt-6">
            <NeonButton size="lg" icon={<Zap />}>
              Save Settings ⚡
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
