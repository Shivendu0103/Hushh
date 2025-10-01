const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Store active socket connections
const activeConnections = new Map()

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return next(new Error('Authentication error'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return next(new Error('User not found'))
    }

    socket.user = user
    socket.userId = user._id.toString()
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
}

// Handle user connection
const handleUserConnection = (socket, io) => {
  const userId = socket.userId
  
  // Store connection
  activeConnections.set(userId, {
    socketId: socket.id,
    userId,
    connectedAt: new Date()
  })

  // Join user's personal room
  socket.join(`user_${userId}`)
  
  // Update user online status
  User.findByIdAndUpdate(userId, { 
    isOnline: true,
    lastSeen: new Date() 
  }).exec()

  // Broadcast online status to friends
  socket.broadcast.emit('user_online', {
    userId,
    timestamp: new Date()
  })

  console.log(`🟢 User ${userId} connected with socket ${socket.id}`)
}

// Handle user disconnection
const handleUserDisconnection = (socket, io) => {
  const userId = socket.userId
  
  if (userId) {
    // Remove from active connections
    activeConnections.delete(userId)
    
    // Update user offline status
    User.findByIdAndUpdate(userId, { 
      isOnline: false,
      lastSeen: new Date() 
    }).exec()

    // Broadcast offline status
    socket.broadcast.emit('user_offline', {
      userId,
      timestamp: new Date()
    })

    console.log(`🔴 User ${userId} disconnected`)
  }
}

// Get active users
const getActiveUsers = () => {
  return Array.from(activeConnections.values())
}

// Check if user is online
const isUserOnline = (userId) => {
  return activeConnections.has(userId.toString())
}

// Send to user
const sendToUser = (io, userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data)
}

// Send to multiple users
const sendToUsers = (io, userIds, event, data) => {
  userIds.forEach(userId => {
    io.to(`user_${userId}`).emit(event, data)
  })
}

// Broadcast to all users except sender
const broadcastExcept = (socket, event, data) => {
  socket.broadcast.emit(event, data)
}

// Room management
const joinRoom = (socket, roomName) => {
  socket.join(roomName)
  console.log(`📡 Socket ${socket.id} joined room: ${roomName}`)
}

const leaveRoom = (socket, roomName) => {
  socket.leave(roomName)
  console.log(`📡 Socket ${socket.id} left room: ${roomName}`)
}

// Typing indicators
const handleTyping = (socket, io, data) => {
  const { recipientId, isTyping } = data
  const event = isTyping ? 'user_typing' : 'user_stopped_typing'
  
  sendToUser(io, recipientId, event, {
    userId: socket.userId,
    timestamp: new Date()
  })
}

module.exports = {
  authenticateSocket,
  handleUserConnection,
  handleUserDisconnection,
  getActiveUsers,
  isUserOnline,
  sendToUser,
  sendToUsers,
  broadcastExcept,
  joinRoom,
  leaveRoom,
  handleTyping,
  activeConnections
}
