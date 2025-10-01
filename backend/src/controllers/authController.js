const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validationResult } = require('express-validator')

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

module.exports = { register, login, getMe }
