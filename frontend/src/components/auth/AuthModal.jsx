import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Sparkles, User, Mail, Lock, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AceternitySignup from './AceternitySignup'
import AceternityLogin from './AceternityLogin'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode) // 'login' or 'register'
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1) // For register success step
    const { login, register: registerUser, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode)
            setStep(1)
            reset()
        }
    }, [isOpen, initialMode])

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm()

    const password = watch('password')

    const onLoginSubmit = async (data) => {
        const result = await login(data.email, data.password)
        if (result.success) {
            onClose()
            navigate('/')
        }
    }

    const onRegisterSubmit = async (data) => {
        const result = await registerUser(
            data.username,
            data.email,
            data.password,
            data.displayName || data.username
        )
        if (result.success) {
            setStep(2)
            setTimeout(() => {
                onClose()
                navigate('/')
            }, 2000)
        }
    }

    const fillDemoCreds = () => {
        setMode('login')
        setValue('email', 'demo@hushh.com')
        setValue('password', 'demo123')
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

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {step === 2 ? (
                            <GlassCard className="p-12 text-center" variant="neon" glow>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold neon-text mb-4">
                                        Welcome to Hushh! 🎉
                                    </h2>
                                    <p className="text-gray-300 mb-6">
                                        Your journey into the future of social media begins now!
                                    </p>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
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
                        ) : (
                            <GlassCard className="p-8 space-y-6" variant="neon">
                                {mode === 'register' ? (
                                    <AceternitySignup onSwitchToLogin={() => setMode('login')} onClose={onClose} />
                                ) : (
                                    <AceternityLogin onSwitchToRegister={() => setMode('register')} onClose={onClose} />
                                )}
                            </GlassCard>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AuthModal
