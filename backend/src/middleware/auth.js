const jwt = require('jsonwebtoken')
const User = require('../models/User')

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
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from token
      req.user = await User.findById(decoded.id)
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user not found'
        })
      }

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
