import { useState } from 'react'
import { Plus, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function StoryViewer({ stories, initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const { user } = useAuth()

    const currentStory = stories[currentIndex]

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(curr => curr + 1)
        } else {
            onClose()
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(curr => curr - 1)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            >
                <X size={24} />
            </button>

            <div className="relative w-full max-w-md aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Progress Bars */}
                <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-20">
                    {stories.map((s, idx) => (
                        <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: idx < currentIndex ? '100%' : '0%' }}
                                animate={{ width: idx === currentIndex ? '100%' : idx < currentIndex ? '100%' : '0%' }}
                                transition={{ duration: idx === currentIndex ? 5 : 0, ease: 'linear' }}
                                onAnimationComplete={() => {
                                    if (idx === currentIndex) handleNext()
                                }}
                                className="h-full bg-white"
                            />
                        </div>
                    ))}
                </div>

                {/* User Info */}
                <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-20">
                    <img
                        src={currentStory.author?.avatar || `https://ui-avatars.com/api/?name=${currentStory.author?.username}&background=random`}
                        alt={currentStory.author?.username}
                        className="w-10 h-10 rounded-full border-2 border-primary-500"
                    />
                    <p className="text-white font-medium text-shadow">{currentStory.author?.username}</p>
                </div>

                {/* Media */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentStory.id}
                        src={currentStory.mediaUrl}
                        alt="Story"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Navigation Areas */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer flex items-center p-2" onClick={handlePrev}>
                    {currentIndex > 0 && <ChevronLeft className="text-white/50" />}
                </div>
                <div className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer flex items-center justify-end p-2" onClick={handleNext}>
                    <ChevronRight className="text-white/50" />
                </div>
            </div>
        </motion.div>
    )
}
