const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    displayName: { type: String, maxlength: 50 },
    bio: { type: String, maxlength: 200 },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    themeSong: {
      name: String,
      url: String,
      artist: String
    },
    currentVibe: {
      status: { 
        type: String, 
        enum: ['🎧 Vibing', '📚 Grinding', '🌌 Lost in thoughts', '🔥 On fire', '💫 Dreaming', '⚡ Chaos mode'],
        default: '🌌 Lost in thoughts'
      },
      emoji: { type: String, default: '🌌' },
      color: { type: String, default: '#8338ec' }
    }
  },
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [{
      name: String,
      emoji: String,
      unlockedAt: { type: Date, default: Date.now }
    }],
    badges: [String]
  },
  preferences: {
    chaosMode: { type: Boolean, default: false },
    theme: { type: String, enum: ['dark', 'neon', 'chaos'], default: 'dark' },
    notifications: {
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    }
  },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { 
  timestamps: true 
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
