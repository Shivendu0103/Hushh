const User = require('../models/User')
const Connection = require('../models/Connection')
const Post = require('../models/Post')

// @desc    Get all users (for discovery)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('username profile gamification isOnline lastSeen')
      .sort({ 'gamification.xp': -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(await User.countDocuments() / limit)
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections.user', 'username profile')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get user stats
    const postCount = await Post.countDocuments({ author: user._id })
    const connections = await Connection.getUserConnections(user._id)

    const userProfile = {
      ...user.toObject(),
      stats: {
        posts: postCount,
        followers: connections.filter(c => c.recipient.equals(user._id)).length,
        following: connections.filter(c => c.requester.equals(user._id)).length
      }
    }

    res.json({
      success: true,
      user: userProfile
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update user profile
// @route   PATCH /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['profile.displayName', 'profile.bio', 'profile.avatar', 'profile.coverImage', 'profile.currentVibe']
    const updates = {}

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    })
  }
}

// @desc    Search users
// @route   GET /api/users/search
const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        users: []
      })
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.displayName': { $regex: q, $options: 'i' } }
      ]
    })
    .select('username profile gamification')
    .limit(parseInt(limit))

    res.json({
      success: true,
      users
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Send connection request
// @route   POST /api/users/connect/:userId
const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot connect to yourself'
      })
    }

    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: userId },
        { requester: userId, recipient: req.user.id }
      ]
    })

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection already exists'
      })
    }

    const connection = await Connection.create({
      requester: req.user.id,
      recipient: userId
    })

    // Real-time notification
    req.io.to(`user_${userId}`).emit('new_notification', {
      id: Date.now(),
      type: 'follow',
      message: `${req.user.username} sent you a connection request`,
      senderId: req.user.id,
      timestamp: new Date(),
      read: false
    })

    res.status(201).json({
      success: true,
      message: 'Connection request sent',
      connection
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Accept connection request
// @route   PATCH /api/users/connect/:requestId/accept
const acceptConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.requestId)

    if (!connection || connection.recipient.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      })
    }

    connection.status = 'accepted'
    connection.connectedAt = new Date()
    await connection.save()

    // Award XP for new connection
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'gamification.xp': 15 }
    })

    await User.findByIdAndUpdate(connection.requester, {
      $inc: { 'gamification.xp': 15 }
    })

    // Real-time notification
    req.io.to(`user_${connection.requester}`).emit('new_notification', {
      id: Date.now(),
      type: 'follow',
      message: `${req.user.username} accepted your connection request`,
      senderId: req.user.id,
      timestamp: new Date(),
      read: false
    })

    res.json({
      success: true,
      message: 'Connection request accepted',
      connection
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Decline connection request
// @route   PATCH /api/users/connect/:requestId/decline
const declineConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.requestId)

    if (!connection || connection.recipient.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      })
    }

    connection.status = 'declined'
    await connection.save()

    res.json({
      success: true,
      message: 'Connection request declined'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user connections
// @route   GET /api/users/connections
const getConnections = async (req, res) => {
  try {
    const connections = await Connection.getUserConnections(req.user.id)

    res.json({
      success: true,
      connections
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user stats
// @route   GET /api/users/:id/stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id

    const [postCount, connections] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Connection.getUserConnections(userId)
    ])

    const stats = {
      posts: postCount,
      followers: connections.filter(c => c.recipient.equals(userId)).length,
      following: connections.filter(c => c.requester.equals(userId)).length,
      connections: connections.length
    }

    res.json({
      success: true,
      stats
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  getUsers,
  getUserProfile,
  updateProfile,
  searchUsers,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnections,
  getUserStats
}
