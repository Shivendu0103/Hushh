import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Sparkles } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import { useMutation, useQueryClient } from 'react-query'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    'profile.displayName': user?.profile?.displayName || '',
    'profile.bio': user?.profile?.bio || '',
    'profile.avatar': user?.profile?.avatar || '',
    'profile.currentVibe.status': user?.profile?.currentVibe?.status || '',
    'profile.currentVibe.emoji': user?.profile?.currentVibe?.emoji || '🌌',
    'profile.currentVibe.color': user?.profile?.currentVibe?.color || '#8338ec',
  })

  const updateProfileMutation = useMutation(
    async (updates) => {
      const res = await api.patch('/users/profile', updates)
      return res.user
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', user.id])
        queryClient.invalidateQueries('currentUser')
        toast.success('Profile updated successfully!')
        onClose()
      },
      onError: () => toast.error('Failed to update profile')
    }
  )

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Nest the object correctly for the backend
    const updates = {
      profile: {
        displayName: formData['profile.displayName'],
        bio: formData['profile.bio'],
        avatar: formData['profile.avatar'],
        currentVibe: {
          status: formData['profile.currentVibe.status'],
          emoji: formData['profile.currentVibe.emoji'],
          color: formData['profile.currentVibe.color']
        }
      }
    }
    updateProfileMutation.mutate(updates)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg z-10"
        >
          <GlassCard className="p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold neon-text flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> Select Your Vibe
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  name="profile.displayName"
                  value={formData['profile.displayName']}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="Your awesome name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  name="profile.bio"
                  value={formData['profile.bio']}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Tell the universe about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  name="profile.avatar"
                  value={formData['profile.avatar']}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="https://example.com/your-image.jpg"
                />
              </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Vibe</label>
                    <input
                      type="text"
                      name="profile.currentVibe.status"
                      value={formData['profile.currentVibe.status']}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="Lost in thoughts"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vibe Emoji</label>
                    <input
                      type="text"
                      name="profile.currentVibe.emoji"
                      value={formData['profile.currentVibe.emoji']}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="🌌"
                      maxLength={2}
                    />
                 </div>
               </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <NeonButton type="button" variant="ghost" className="mr-3" onClick={onClose}>
                  Cancel
                </NeonButton>
                <NeonButton type="submit" disabled={updateProfileMutation.isLoading} icon={<Save />}>
                  {updateProfileMutation.isLoading ? 'Saving...' : 'Save Profile'}
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EditProfileModal
