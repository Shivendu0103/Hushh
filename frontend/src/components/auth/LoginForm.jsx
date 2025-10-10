import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md"
      >
        <div 
          className="glass glass-hover p-8 space-y-6 rounded-3xl" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.h1
              className="text-4xl font-black neon-text"
              animate={isHovered ? { 
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            >
              Hushh ✨
            </motion.h1>
            <p className="text-gray-300">Welcome back to the future</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Enter your email"
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

            {/* Password Field */}
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
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full neon-gradient px-6 py-3 rounded-xl font-bold text-white hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Enter the Vibe ⚡</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Don't have an account? Join the future 🚀
            </Link>
            
            {/* Demo credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <p className="text-xs text-gray-400 mb-1">Demo Credentials:</p>
              <p className="text-xs text-gray-300">Email: demo@hushh.com</p>
              <p className="text-xs text-gray-300">Password: demo123</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginForm
