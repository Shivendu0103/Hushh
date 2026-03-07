import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import AuthModal from '../components/auth/AuthModal'
import { CanvasText, cn } from '../components/ui/canvas-text'
import { ShimmerButton } from '../components/ui/shimmer-button'
import TextPressure from '../components/ui/TextPressure'

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login')
    const location = useLocation()


    // Force dark mode for aceternity components
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const openAuth = (mode) => {
        setAuthMode(mode)
        setIsAuthModalOpen(true)
    }

    return (
        <div className="min-h-screen flex flex-col relative z-10 w-full font-sans overflow-hidden">
            {/* Dim overlay when modal is open */}
            <div
                className={`fixed inset-0 z-0 bg-black/40 transition-opacity duration-500 pointer-events-none ${isAuthModalOpen ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Top Nav Pill */}
            <div className="w-full flex justify-center pt-8 absolute top-0 left-0 z-40">
                <div className="flex items-center justify-between bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 w-[90%] max-w-4xl shadow-2xl">
                    <div className="flex items-center space-x-2 text-white font-semibold text-lg tracking-tight">
                        <Zap className="w-5 h-5" />
                        <span>Hushh</span>
                    </div>
                    <div className="flex space-x-8 text-white/90 font-medium text-sm">
                        <button onClick={() => openAuth('login')} className="hover:text-white transition-colors">Login</button>
                        <button onClick={() => openAuth('register')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">Join</button>
                    </div>
                </div>
            </div>

            {/* Main Content Hero */}
            <div className="flex-1 flex items-center justify-center p-4 mt-16 z-10 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-3xl flex flex-col items-center text-center pointer-events-auto"
                >


                    {/* Big Heading */}
                    <div className="mx-auto mt-4 max-w-2xl text-center font-bold tracking-tight text-white mb-8">
                        <div className="h-32 sm:h-40 md:h-48 xl:h-56 relative w-full mb-4">
                            <TextPressure
                                text="Hushh!"
                                flex={true}
                                alpha={false}
                                stroke={false}
                                width={true}
                                weight={true}
                                italic={true}
                                textColor="#ffffff"
                                className="font-sans"
                                minFontSize={60}
                            />
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl">
                            What's not to like about {" "}
                            <CanvasText
                                text="connecting?"
                                backgroundClassName="bg-blue-600 dark:bg-blue-700"
                                colors={[
                                    "rgba(0, 153, 255, 1)",
                                    "rgba(0, 153, 255, 0.9)",
                                    "rgba(0, 153, 255, 0.8)",
                                    "rgba(0, 153, 255, 0.7)",
                                    "rgba(0, 153, 255, 0.6)",
                                    "rgba(0, 153, 255, 0.5)",
                                    "rgba(0, 153, 255, 0.4)",
                                    "rgba(0, 153, 255, 0.3)",
                                    "rgba(0, 153, 255, 0.2)",
                                    "rgba(0, 153, 255, 0.1)",
                                ]}
                                lineGap={4}
                                animationDuration={20} />
                        </h2>
                    </div>

                    <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto font-medium">
                        Enter a new realm of social discovery. Connect globally with a vibe strictly locally.
                    </p>

                    <div className="flex justify-center text-center mt-4">
                        <ShimmerButton
                            onClick={() => openAuth('login')}
                            className="px-8 py-4 text-lg font-semibold shadow-2xl flex items-center space-x-2"
                            shimmerColor="#ffffff"
                            shimmerSize="0.1em"
                        >
                            <span className="relative z-10 text-white dark:text-white">Enter Hushh</span>
                            <Sparkles className="w-5 h-5 relative z-10 text-white dark:text-white group-hover:rotate-12 transition-transform" />
                        </ShimmerButton>
                    </div>
                </motion.div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    )
}

export default LandingPage
