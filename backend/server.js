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

const app = express()
const server = http.createServer(app)

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
})

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
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
  socket.on('user_join', (userId) => {
    activeUsers.set(socket.id, { userId, socketId: socket.id })
    socket.join(`user_${userId}`)
    
    // Broadcast user online status
    socket.broadcast.emit('user_online', userId)
    
    console.log(`👋 User ${userId} joined`)
  })

  // Real-time messaging
  socket.on('send_message', async (data) => {
    try {
      const { recipientId, senderId, content, type = 'text' } = data
      
      // Save message to database (implement this)
      const message = {
        id: Date.now(),
        senderId,
        recipientId,
        content,
        type,
        timestamp: new Date(),
        read: false
      }

      // Send to recipient if online
      io.to(`user_${recipientId}`).emit('new_message', {
        ...message,
        sender: data.sender
      })

      // Confirm delivery to sender
      socket.emit('message_sent', { messageId: message.id, status: 'delivered' })
      
      console.log(`💬 Message from ${senderId} to ${recipientId}`)
    } catch (error) {
      socket.emit('message_error', { error: error.message })
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
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id)
    if (user) {
      // Broadcast user offline status
      socket.broadcast.emit('user_offline', user.userId)
      activeUsers.delete(socket.id)
      console.log(`👋 User ${user.userId} disconnected`)
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
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`⚡ Socket.io enabled for real-time features!`)
  console.log(`✨ Ready for REAL users to connect!`)
})
