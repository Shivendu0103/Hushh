const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    // Log connection status
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB')
    })
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('📡 Mongoose disconnected')
    })
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
