const Message = require('../models/Message')
const User = require('../models/User')
const Connection = require('../models/Connection')

// @desc    Send message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = 'text', replyTo } = req.body

    // Validate input
    if (!recipientId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message content are required'
      })
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      })
    }

    // Optional: Check if users are connected (commented out for open messaging)
    // const areConnected = await Connection.areConnected(req.user.id, recipientId)
    // if (!areConnected) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'You can only message connected users'
    //   })
    // }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content: content.trim(),
      messageType,
      replyTo
    })

    await message.populate('sender recipient', 'username profile')

    // Real-time delivery via socket
    req.io.to(`user_${recipientId}`).emit('new_message', {
      _id: message._id,
      sender: {
        _id: message.sender._id,
        username: message.sender.username,
        displayName: message.sender.profile?.displayName,
        avatar: message.sender.profile?.avatar
      },
      content: message.content,
      messageType: message.messageType,
      timestamp: message.createdAt,
      replyTo: message.replyTo
    })

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    })

  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error sending message',
      error: error.message
    })
  }
}

// @desc    Get conversation with specific user
// @route   GET /api/messages/:userId
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ],
      deleted: false
    })
    .populate('sender recipient', 'username profile')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .limit(limit * page)

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: req.user.id, status: { $ne: 'read' } },
      { status: 'read', $push: { readBy: { user: req.user.id } } }
    )

    // Format messages consistently
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      senderId: msg.sender._id.toString(),
      recipientId: msg.recipient._id.toString(),
      content: msg.content,
      messageType: msg.messageType,
      timestamp: msg.createdAt,
      createdAt: msg.createdAt,
      sender: {
        _id: msg.sender._id,
        id: msg.sender._id.toString(),
        username: msg.sender.username,
        displayName: msg.sender.profile?.displayName || msg.sender.username,
        avatar: msg.sender.profile?.avatar
      },
      status: msg.status,
      read: msg.status === 'read',
      replyTo: msg.replyTo
    }))

    res.json({
      success: true,
      messages: formattedMessages.reverse(),
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit * page
      }
    })

  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    })
  }
}

// @desc    Get all conversations
// @route   GET /api/messages
// @desc    Get all conversations
// @route   GET /api/messages
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id

    console.log('🔍 Getting conversations for user:', userId)

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ],
          deleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', userId] },
                    { $ne: ['$status', 'read'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: {
          path: '$otherUser',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: '$otherUser._id',
          otherUser: {
            _id: '$otherUser._id',
            username: '$otherUser.username',
            profile: '$otherUser.profile'
          },
          lastMessage: {
            content: '$lastMessage.content',
            timestamp: '$lastMessage.createdAt',
            sender: '$lastMessage.sender'
          },
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ])

    console.log('✅ Found conversations:', conversations.length)
    if (conversations.length > 0) {
      console.log('First conversation:', JSON.stringify(conversations[0], null, 2))
    }

    res.json({
      success: true,
      conversations
    })

  } catch (error) {
    console.error('❌ Get conversations error:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversations',
      error: error.message
    })
  }
}


// @desc    Mark message as read
// @route   PATCH /api/messages/:messageId/read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId)
    
    if (!message || message.recipient.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      })
    }

    message.status = 'read'
    message.readBy.push({ user: req.user.id })
    await message.save()

    // Notify sender of read receipt
    req.io.to(`user_${message.sender}`).emit('message_read', {
      messageId: message._id,
      readBy: req.user.id
    })

    res.json({
      success: true,
      message: 'Message marked as read'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/react
const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body
    const message = await Message.findById(req.params.messageId)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      })
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      reaction => reaction.user.toString() !== req.user.id
    )

    // Add new reaction
    message.reactions.push({
      user: req.user.id,
      emoji
    })

    await message.save()

    // Real-time update
    const otherUserId = message.sender.toString() === req.user.id 
      ? message.recipient 
      : message.sender

    req.io.to(`user_${otherUserId}`).emit('message_reaction', {
      messageId: message._id,
      userId: req.user.id,
      emoji
    })

    res.json({
      success: true,
      message: 'Reaction added',
      reactions: message.reactions
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId)

    if (!message || message.sender.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      })
    }

    message.deleted = true
    message.deletedAt = new Date()
    await message.save()

    res.json({
      success: true,
      message: 'Message deleted'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  addReaction,
  deleteMessage
}
