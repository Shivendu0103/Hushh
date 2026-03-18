const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const { verifyFirebaseToken } = require('../config/firebaseAdmin')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      })
    }

    const { username, email, password, displayName } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with that email or username'
      })
    }

    // Create user with default achievements
    const user = await User.create({
      username,
      email,
      password,
      profile: {
        displayName: displayName || username,
      },
      gamification: {
        achievements: [{
          name: 'Welcome to Hushh',
          emoji: '🎉',
          unlockedAt: new Date()
        }]
      }
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: '🎉 Welcome to Hushh! Your journey begins now!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gamification: user.gamification
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update online status
    user.isOnline = true
    user.lastSeen = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: `🔥 Welcome back, ${user.profile.displayName || user.username}!`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gamification: user.gamification,
        preferences: user.preferences
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gamification: user.gamification,
        preferences: user.preferences,
        isOnline: user.isOnline
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Firebase auth - create/login user via Firebase token
// @route   POST /api/auth/firebase
const firebaseAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No Firebase token provided' })
    }

    const idToken = authHeader.split(' ')[1]

    // Verify with Firebase Admin (if configured)
    let firebaseUser = null
    const decoded = await verifyFirebaseToken(idToken)
    if (decoded) {
      firebaseUser = decoded
    } else {
      // Firebase admin not configured — trust the client-side data for dev
      console.warn('⚠️  Firebase token not verified (admin not configured). Using request body.')
    }

    const { uid, email, displayName, photoURL, username, provider } = req.body

    // Use verified data if available, else fall back to body
    const firebaseUid = firebaseUser?.uid || uid
    const firebaseEmail = firebaseUser?.email || email

    if (!firebaseUid || !firebaseEmail) {
      return res.status(400).json({ success: false, message: 'Invalid Firebase user data' })
    }

    // Find existing user by Firebase UID or email
    let user = await User.findOne({
      $or: [{ firebaseUid: firebaseUid }, { email: firebaseEmail }]
    })

    if (user) {
      // Update Firebase UID if not set (linking existing account)
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid
        await user.save()
      }
      // Update online status
      user.isOnline = true
      user.lastSeen = new Date()
      await user.save()
    } else {
      // Create new user from Firebase data
      // Generate a unique username if not provided
      let finalUsername = username
      if (!finalUsername) {
        // Derive from email or displayName
        const base = (displayName || email.split('@')[0])
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 15)
        finalUsername = base || 'user'
        
        // Ensure uniqueness
        let counter = 0
        let candidate = finalUsername
        while (await User.findOne({ username: candidate })) {
          counter++
          candidate = `${finalUsername}${counter}`
        }
        finalUsername = candidate
      } else {
        // Ensure the provided username is unique
        let counter = 0
        let candidate = finalUsername
        while (await User.findOne({ username: candidate })) {
          counter++
          candidate = `${finalUsername}${counter}`
        }
        finalUsername = candidate
      }

      // Random password for Firebase users (they won't use it)
      const randomPassword = Math.random().toString(36) + Math.random().toString(36)

      user = await User.create({
        username: finalUsername,
        email: firebaseEmail,
        password: randomPassword,
        firebaseUid: firebaseUid,
        profile: {
          displayName: displayName || finalUsername,
          avatar: photoURL || ''
        },
        gamification: {
          achievements: [{
            name: 'Welcome to Hushh',
            emoji: '🎉',
            unlockedAt: new Date()
          }]
        }
      })
    }

    // Generate our custom JWT
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: `🔥 Welcome${user.createdAt === user.updatedAt ? ' to Hushh' : ' back'}, ${user.profile.displayName || user.username}!`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gamification: user.gamification,
        preferences: user.preferences
      }
    })

  } catch (error) {
    console.error('Firebase auth error:', error)
    res.status(500).json({ success: false, message: 'Server error during Firebase auth' })
  }
}

module.exports = { register, login, getMe, firebaseAuth }
