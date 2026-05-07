const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Cache for decoded tokens to avoid repeated JWT parsing
const tokenCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    try {
      let decoded

      // Check cache first
      if (tokenCache.has(token)) {
        const cached = tokenCache.get(token)
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          decoded = cached.data
        } else {
          tokenCache.delete(token)
        }
      }

      // Verify token if not cached
      if (!decoded) {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        tokenCache.set(token, { data: decoded, timestamp: Date.now() })
      }

      // Store only the ID in the request - avoid full user fetch when possible
      req.user = { id: decoded.id }
      req.userId = decoded.id

      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    })
  }
}

module.exports = { protect }
