import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import AuthModal from '../components/auth/AuthModal'
import { CanvasText, cn } from '../components/ui/canvas-text'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { Meteors } from '../components/ui/meteors'
import TextPressure from '../components/ui/TextPressure'
import ReactBitsParticles from '../components/ui/Particles'
import { ElegantShape } from '../components/ui/shape-landing-hero'

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
        <div className="min-h-screen bg-[#030303] overflow-hidden selection:bg-purple-500/30 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
                <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-500/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
                <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
                <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/[0.15]" className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" />
                <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/[0.15]" className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

            <ReactBitsParticles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={true}
                disableRotation={false}
            />

            {/* Content Wrapper */}
            <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
                {/* Dim overlay when modal is open */}
                <div
                    className={`fixed inset-0 z-0 bg-black/40 transition-opacity duration-500 pointer-events-none ${isAuthModalOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Top Nav Pill */}
                <div className="w-full flex justify-center pt-8 absolute top-0 left-0 z-40">
                    <div className="flex items-center justify-between bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 w-[90%] max-w-4xl shadow-2xl pointer-events-auto">
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


                        {/* Big Heading inside Meteors Box */}
                        <div className="relative w-full max-w-4xl">
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl opacity-20" />
                            <div className="relative shadow-2xl bg-gray-900/50 backdrop-blur-sm border border-white/10 px-8 py-12 rounded-3xl overflow-hidden mb-8">
                                <Meteors number={20} />

                                <div className="mx-auto max-w-2xl text-center font-bold tracking-tight text-white relative z-10">
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
                                    <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl mt-4">
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
                            </div>
                        </div>



                        <div className="flex justify-center text-center mt-4 pointer-events-auto">
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

                <div className="pointer-events-auto">
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                        initialMode={authMode}
                    />
                </div>
            </div>
        </div>
    )
}

export default LandingPage
