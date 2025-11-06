import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import { useAuth } from '../../context/AuthContext'

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
  console.log('🔍 Register form data:', data)
  
  // ✅ CORRECT - Pass individual parameters
  const result = await registerUser(
    data.username,
    data.email,
    data.password,
    data.displayName || data.username  // Use username if displayName is empty
  )
  
  if (result.success) {
    setStep(2)
    setTimeout(() => navigate('/'), 2000)
  }
}


  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 6) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*]/.test(password)) strength += 1

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Epic']
    const colors = ['red', 'orange', 'yellow', 'green', 'purple']
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'gray'
    }
  }

  const pwdStrength = passwordStrength(password)

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <GlassCard className="p-12" variant="neon" glow>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold neon-text mb-4">
                Welcome to Hushh! 🎉
              </h2>
              <p className="text-gray-300 mb-6">
                Your journey into the future of social media begins now!
              </p>
              
              {/* Achievement unlocked animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="glass p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  🏆 Achievement Unlocked!
                </h3>
                <p className="text-purple-300">
                  Welcome to Hushh - First steps into the vibe ✨
                </p>
              </motion.div>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 space-y-6" variant="neon">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.h1
              className="text-4xl font-black neon-text"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Join Hushh ✨
            </motion.h1>
            <p className="text-gray-300">Create your vibe, own your space</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' },
                    maxLength: { value: 20, message: 'Maximum 20 characters' },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Only letters, numbers, and underscores allowed'
                    }
                  })}
                  className="
                    w-full pl-10 pr-4 py-3 rounded-xl
                    bg-white/10 backdrop-blur-lg border border-white/20
                    text-white placeholder-gray-400
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                    transition-all duration-300
                  "
                  placeholder="Your unique handle"
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                  type="email"
                  className="
                    w-full pl-10 pr-4 py-3 rounded-xl
                    bg-white/10 backdrop-blur-lg border border-white/20
                    text-white placeholder-gray-400
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                    transition-all duration-300
                  "
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password with strength indicator */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="
                    w-full pl-10 pr-12 py-3 rounded-xl
                    bg-white/10 backdrop-blur-lg border border-white/20
                    text-white placeholder-gray-400
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                    transition-all duration-300
                  "
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= pwdStrength.strength
                              ? `bg-${pwdStrength.color}-500`
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs text-${pwdStrength.color}-400`}>
                      Password strength: {pwdStrength.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                {...register('displayName', {
                  maxLength: { value: 50, message: 'Maximum 50 characters' }
                })}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/10 backdrop-blur-lg border border-white/20
                  text-white placeholder-gray-400
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                  transition-all duration-300
                "
                placeholder="How others see you"
              />
              {errors.displayName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.displayName.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <NeonButton
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              icon={<Sparkles />}
            >
              {loading ? 'Creating your vibe...' : 'Join the Future 🚀'}
            </NeonButton>
          </form>

          {/* Footer */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Already have an account? Enter the vibe ⚡
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default RegisterForm
