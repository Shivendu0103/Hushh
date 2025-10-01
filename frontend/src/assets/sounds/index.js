// Sound effects for Hushh interactions
export const soundEffects = {
  // Notification sounds
  notification: {
    subtle: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAs=', // Subtle beep
    message: '/sounds/message.mp3',
    like: '/sounds/like.mp3',
    achievement: '/sounds/achievement.mp3'
  },
  
  // UI interaction sounds
  ui: {
    click: '/sounds/click.mp3',
    hover: '/sounds/hover.mp3',
    swoosh: '/sounds/swoosh.mp3',
    pop: '/sounds/pop.mp3'
  },
  
  // Social interaction sounds
  social: {
    connectionMade: '/sounds/connection.mp3',
    levelUp: '/sounds/levelup.mp3',
    chaosMode: '/sounds/chaos.mp3',
    heartReaction: '/sounds/heart.mp3'
  }
}

// Audio manager class
export class AudioManager {
  constructor() {
    this.sounds = new Map()
    this.volume = 0.5
    this.muted = false
    this.initialized = false
  }

  // Initialize audio context (requires user interaction)
  async initialize() {
    if (this.initialized) return
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Preload common sounds
      await this.preloadSounds([
        'notification.subtle',
        'ui.click',
        'ui.pop'
      ])
      
      this.initialized = true
      console.log('🔊 Audio Manager initialized')
    } catch (error) {
      console.warn('Audio initialization failed:', error)
    }
  }

  // Preload sound files
  async preloadSounds(soundKeys) {
    const promises = soundKeys.map(async (key) => {
      const soundPath = this.getSoundPath(key)
      if (soundPath) {
        try {
          const audio = new Audio(soundPath)
          audio.volume = this.volume
          this.sounds.set(key, audio)
        } catch (error) {
          console.warn(`Failed to preload sound: ${key}`, error)
        }
      }
    })
    
    await Promise.allSettled(promises)
  }

  // Get sound file path
  getSoundPath(key) {
    const keys = key.split('.')
    let current = soundEffects
    
    for (const k of keys) {
      current = current[k]
      if (!current) return null
    }
    
    return current
  }

  // Play sound effect
  async playSound(key, options = {}) {
    if (this.muted || !this.initialized) return
    
    try {
      let audio = this.sounds.get(key)
      
      if (!audio) {
        const soundPath = this.getSoundPath(key)
        if (!soundPath) return
        
        audio = new Audio(soundPath)
        this.sounds.set(key, audio)
      }
      
      // Apply options
      audio.volume = (options.volume ?? this.volume) * (options.fadeIn ? 0 : 1)
      audio.playbackRate = options.speed ?? 1
      
      // Reset audio to beginning
      audio.currentTime = 0
      
      // Play sound
      const playPromise = audio.play()
      
      if (playPromise) {
        await playPromise
        
        // Handle fade in
        if (options.fadeIn) {
          this.fadeIn(audio, options.fadeIn)
        }
        
        // Handle fade out
        if (options.fadeOut) {
          setTimeout(() => {
            this.fadeOut(audio, options.fadeOut)
          }, (audio.duration - options.fadeOut) * 1000)
        }
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${key}`, error)
    }
  }

  // Fade in effect
  fadeIn(audio, duration) {
    audio.volume = 0
    const targetVolume = this.volume
    const steps = 20
    const stepSize = targetVolume / steps
    const stepDuration = (duration * 1000) / steps
    
    const interval = setInterval(() => {
      if (audio.volume < targetVolume) {
        audio.volume = Math.min(audio.volume + stepSize, targetVolume)
      } else {
        clearInterval(interval)
      }
    }, stepDuration)
  }

  // Fade out effect
  fadeOut(audio, duration) {
    const initialVolume = audio.volume
    const steps = 20
    const stepSize = initialVolume / steps
    const stepDuration = (duration * 1000) / steps
    
    const interval = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - stepSize, 0)
      } else {
        clearInterval(interval)
        audio.pause()
      }
    }, stepDuration)
  }

  // Set global volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    
    // Update all loaded sounds
    this.sounds.forEach(audio => {
      audio.volume = this.volume
    })
  }

  // Mute/unmute
  setMuted(muted) {
    this.muted = muted
    
    if (muted) {
      this.sounds.forEach(audio => audio.pause())
    }
  }

  // Quick play methods for common sounds
  playNotification(type = 'subtle') {
    this.playSound(`notification.${type}`)
  }

  playClick() {
    this.playSound('ui.click')
  }

  playPop() {
    this.playSound('ui.pop', { volume: 0.3 })
  }

  playAchievement() {
    this.playSound('social.achievement', { volume: 0.7 })
  }

  playLevelUp() {
    this.playSound('social.levelUp', { volume: 0.8 })
  }

  playChaosMode() {
    this.playSound('social.chaosMode', { volume: 0.6, fadeIn: 0.5 })
  }
}

// Create global audio manager instance
export const audioManager = new AudioManager()

// React hook for using audio
export const useAudio = () => {
  const [initialized, setInitialized] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  useEffect(() => {
    const initAudio = async () => {
      await audioManager.initialize()
      setInitialized(true)
    }

    // Initialize on first user interaction
    const handleInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  const toggleMute = () => {
    const newMuted = !muted
    setMuted(newMuted)
    audioManager.setMuted(newMuted)
  }

  const changeVolume = (newVolume) => {
    setVolume(newVolume)
    audioManager.setVolume(newVolume)
  }

  return {
    initialized,
    muted,
    volume,
    toggleMute,
    changeVolume,
    playSound: audioManager.playSound.bind(audioManager),
    playNotification: audioManager.playNotification.bind(audioManager),
    playClick: audioManager.playClick.bind(audioManager),
    playPop: audioManager.playPop.bind(audioManager),
    playAchievement: audioManager.playAchievement.bind(audioManager),
    playLevelUp: audioManager.playLevelUp.bind(audioManager),
    playChaosMode: audioManager.playChaosMode.bind(audioManager)
  }
}

export default {
  soundEffects,
  AudioManager,
  audioManager,
  useAudio
}
