const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const http = require('http')
require('dotenv').config()

// Import database connection
const connectDB = require('./src/config/db')

// Import routes
const authRoutes = require('./src/routes/auth')

const app = express()
const server = http.createServer(app)

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

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '🔥 Hushh Backend is LIVE!',
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
  console.log(`✨ Ready to authenticate Gen Z users!`)
})
