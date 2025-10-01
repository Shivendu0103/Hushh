const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  },
  connectionType: {
    type: String,
    enum: ['friend', 'follow', 'mutual'],
    default: 'friend'
  },
  connectedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
})

// Prevent duplicate connections
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true })

// Helper method to check if users are connected
connectionSchema.statics.areConnected = async function(userId1, userId2) {
  const connection = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  })
  return !!connection
}

// Helper method to get user's connections
connectionSchema.statics.getUserConnections = async function(userId, status = 'accepted') {
  return await this.find({
    $or: [
      { requester: userId, status },
      { recipient: userId, status }
    ]
  }).populate('requester recipient', 'username profile')
}

module.exports = mongoose.model('Connection', connectionSchema)
