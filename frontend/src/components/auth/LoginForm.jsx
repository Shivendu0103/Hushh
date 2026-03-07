import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Zap, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      navigate('/')
    }
  }

  const fillDemoCreds = () => {
    setValue('email', 'demo@hushh.com')
    setValue('password', 'demo123')
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10 w-full font-sans overflow-hidden">
      {/* Top Nav Pill */}
      <div className="w-full flex justify-center pt-8 absolute top-0 left-0 z-50">
        <div className="flex items-center justify-between bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 w-[90%] max-w-4xl shadow-2xl">
          <div className="flex items-center space-x-2 text-white font-semibold text-lg tracking-tight">
            <Zap className="w-5 h-5" />
            <span>Hushh Bits</span>
          </div>
          <div className="flex space-x-8 text-white/90 font-medium text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/register" className="hover:text-white transition-colors">Docs</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl flex flex-col items-center"
        >
          {/* Decorative Tag */}
          <div className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 text-sm flex items-center space-x-2 cursor-pointer hover:bg-white/10 transition-colors">
            <Sparkles className="w-4 h-4 opacity-70" />
            <span className="tracking-wide">New Dimension</span>
          </div>

          {/* Big Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight leading-[1.1] mb-12">
            Hushh! What's not to like<br />about connecting?
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg space-y-4 flex flex-col items-center">
            {/* Input Row for Email */}
            <div className="w-full relative">
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="Email address"
                className="w-full px-6 py-4 rounded-full bg-white text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-shadow font-medium shadow-xl"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 ml-4 absolute -bottom-6">{errors.email.message}</p>
              )}
            </div>

            {/* Input Row for Password */}
            <div className="w-full relative mt-6">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-6 py-4 rounded-full bg-[#111] backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 ml-4 absolute -bottom-6">{errors.password.message}</p>
              )}
            </div>

            {/* Buttons Row */}
            <div className="w-full flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-[1.2] py-4 px-6 rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-100 disabled:opacity-70 transition-colors shadow-xl flex justify-center items-center"
              >
                {loading ? <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex-1 py-4 px-6 rounded-full bg-[#111] border border-white/10 text-white/90 font-semibold text-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Demo toggle at bottom right */}
      <div
        onClick={fillDemoCreds}
        className="fixed bottom-8 right-8 flex items-center space-x-3 text-white/50 text-sm font-medium z-20 cursor-pointer hover:text-white transition-colors group"
      >
        <span>Demo Content</span>
        <div className="w-10 h-6 bg-white/20 rounded-full p-1 relative flex items-center group-hover:bg-white/30 transition-colors">
          <div className="w-4 h-4 rounded-full bg-white absolute right-1"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
