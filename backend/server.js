const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const http = require('http')
const socketIo = require('socket.io')
require('dotenv').config()

// Import database connection
const connectDB = require('./src/config/db')

// Import routes
const authRoutes = require('./src/routes/auth')
const userRoutes = require('./src/routes/users')
const postRoutes = require('./src/routes/posts')
const messageRoutes = require('./src/routes/messages')

// Import models
const Message = require('./src/models/Message')
const User = require('./src/models/User')

const app = express()
const server = http.createServer(app)

// CORS configuration - DEFINE THIS FIRST!
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://try-hushh.vercel.app'
]

// Socket.io setup - USE allowedOrigins here
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/messages', messageRoutes)

// Socket.io real-time features
const activeUsers = new Map()

io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`)

  // User joins with their ID
  socket.on('user_join', async (userId) => {
    try {
      activeUsers.set(socket.id, { userId, socketId: socket.id })
      socket.join(`user_${userId}`)
      
      // Update user online status in database
      await User.findByIdAndUpdate(userId, { 
        isOnline: true,
        lastSeen: new Date() 
      })
      
      // Broadcast user online status
      socket.broadcast.emit('user_online', userId)
      
      console.log(`👋 User ${userId} joined`)
    } catch (error) {
      console.error('User join error:', error)
    }
  })

  // Real-time messaging with database persistence
  socket.on('send_message', async (data) => {
    try {
      const { recipientId, senderId, content, type = 'text' } = data
      
      // Validate required fields
      if (!recipientId || !senderId || !content || !content.trim()) {
        socket.emit('message_error', { error: 'Missing required fields' })
        return
      }
      
      // Save message to database
      const newMessage = new Message({
        sender: senderId,
        recipient: recipientId,
        content: content.trim(),
        messageType: type,
        status: 'sent'
      })
      
      const savedMessage = await newMessage.save()
      await savedMessage.populate('sender', 'username profile')
      await savedMessage.populate('recipient', 'username profile')

      // Create consistent message object for real-time transmission
      const messageForSocket = {
        _id: savedMessage._id,
        senderId: savedMessage.sender._id.toString(),
        recipientId: savedMessage.recipient._id.toString(),
        content: savedMessage.content,
        messageType: savedMessage.messageType,
        timestamp: savedMessage.createdAt,
        createdAt: savedMessage.createdAt,
        sender: {
          _id: savedMessage.sender._id,
          id: savedMessage.sender._id.toString(),
          username: savedMessage.sender.username,
          displayName: savedMessage.sender.profile?.displayName || savedMessage.sender.username,
          avatar: savedMessage.sender.profile?.avatar
        },
        status: savedMessage.status,
        read: false
      }

      // Send to recipient if online
      io.to(`user_${recipientId}`).emit('new_message', messageForSocket)

      // Send back to sender for confirmation
      socket.emit('message_sent', { 
        messageId: savedMessage._id, 
        status: 'delivered',
        message: messageForSocket
      })
      
      console.log(`💬 Message saved and sent from ${senderId} to ${recipientId}`)
    } catch (error) {
      console.error('Send message error:', error)
      socket.emit('message_error', { error: error.message })
    }
  })

  // Mark message as read
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId, userId } = data
      
      await Message.findByIdAndUpdate(messageId, {
        status: 'read',
        $push: { readBy: { user: userId, readAt: new Date() } }
      })

      // Notify sender that message was read
      const message = await Message.findById(messageId)
      io.to(`user_${message.sender}`).emit('message_read', {
        messageId,
        readBy: userId
      })
      
    } catch (error) {
      console.error('Mark read error:', error)
    }
  })

  // Real-time post reactions
  socket.on('post_reaction', (data) => {
    const { postId, userId, reaction, postAuthorId } = data
    
    // Broadcast to post author
    io.to(`user_${postAuthorId}`).emit('new_reaction', {
      postId,
      userId,
      reaction,
      timestamp: new Date()
    })

    // Broadcast to all users viewing this post
    socket.broadcast.emit('post_updated', {
      postId,
      type: 'reaction',
      data: { userId, reaction }
    })
  })

  // Real-time typing indicators
  socket.on('typing_start', (data) => {
    const { recipientId, senderId } = data
    io.to(`user_${recipientId}`).emit('user_typing', { userId: senderId })
  })

  socket.on('typing_stop', (data) => {
    const { recipientId, senderId } = data
    io.to(`user_${recipientId}`).emit('user_stopped_typing', { userId: senderId })
  })

  // Real-time notifications
  socket.on('send_notification', (data) => {
    const { recipientId, type, message, senderId } = data
    
    io.to(`user_${recipientId}`).emit('new_notification', {
      id: Date.now(),
      type,
      message,
      senderId,
      timestamp: new Date(),
      read: false
    })
  })

  // User disconnect
  socket.on('disconnect', async () => {
    const user = activeUsers.get(socket.id)
    if (user) {
      try {
        // Update user offline status in database
        await User.findByIdAndUpdate(user.userId, { 
          isOnline: false,
          lastSeen: new Date() 
        })
        
        // Broadcast user offline status
        socket.broadcast.emit('user_offline', user.userId)
        activeUsers.delete(socket.id)
        console.log(`👋 User ${user.userId} disconnected`)
      } catch (error) {
        console.error('User disconnect error:', error)
      }
    }
    console.log(`🔌 Socket disconnected: ${socket.id}`)
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '🔥 Hushh Backend is LIVE!',
    activeUsers: activeUsers.size,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Hushh server running on port ${PORT}`)
  console.log(`📱 Allowed origins: ${allowedOrigins.join(', ')}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`⚡ Socket.io enabled for real-time features!`)
  console.log(`✨ Ready for REAL users to connect!`)
})
