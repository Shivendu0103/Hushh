const Post = require('../models/Post')
const User = require('../models/User')

// @desc    Create new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { content, mood, media = [] } = req.body

    const post = await Post.create({
      author: req.user.id,
      content,
      mood,
      media
    })

    // Populate author details
    await post.populate('author', 'username profile')

    // Award XP for posting
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'gamification.xp': 10 }
    })

    // Broadcast to all connected users
    req.io.emit('new_post', {
      id: post._id,
      author: {
        id: post.author._id,
        username: post.author.username,
        displayName: post.author.profile?.displayName || post.author.username,
        avatar: post.author.profile?.avatar
      },
      content: post.content,
      mood: post.mood,
      media: post.media,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: post.createdAt
    })

    res.status(201).json({
      success: true,
      message: '🚀 Post created successfully!',
      post
    })

  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error creating post'
    })
  }
}

// @desc    Get all posts
// @route   GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate('author', 'username profile')
      .populate('comments.author', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPosts = await Post.countDocuments()

    res.json({
      success: true,
      posts: posts.map(post => ({
        id: post._id,
        author: {
          id: post.author._id,
          username: post.author.username,
          displayName: post.author.profile?.displayName || post.author.username,
          avatar: post.author.profile?.avatar
        },
        content: post.content,
        mood: post.mood,
        media: post.media,
        likes: post.likes.length,
        comments: post.comments.length,
        shares: post.shares || 0,
        createdAt: post.createdAt,
        likedByUser: req.user ? post.likes.includes(req.user.id) : false
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching posts'
    })
  }
}

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username profile')
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    const likeIndex = post.likes.indexOf(req.user.id)
    let action = ''

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user.id)
      action = 'liked'

      // Award XP to post author
      await User.findByIdAndUpdate(post.author._id, {
        $inc: { 'gamification.xp': 5 }
      })

      // Send real-time notification to post author
      if (post.author._id.toString() !== req.user.id) {
        req.io.to(`user_${post.author._id}`).emit('new_notification', {
          id: Date.now(),
          type: 'like',
          message: `${req.user.username} liked your post`,
          senderId: req.user.id,
          postId: post._id,
          timestamp: new Date(),
          read: false
        })
      }
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1)
      action = 'unliked'
    }

    await post.save()

    // Broadcast real-time update
    req.io.emit('post_updated', {
      postId: post._id,
      type: 'like',
      likes: post.likes.length,
      action,
      userId: req.user.id
    })

    res.json({
      success: true,
      message: `Post ${action}!`,
      likes: post.likes.length,
      likedByUser: action === 'liked'
    })

  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts: async (req, res) => {
    // Implementation for user-specific posts
    res.json({ success: true, posts: [] })
  },
  likePost,
  commentPost: async (req, res) => {
    // Implementation for comments
    res.json({ success: true, message: 'Comment added' })
  },
  deletePost: async (req, res) => {
    // Implementation for delete
    res.json({ success: true, message: 'Post deleted' })
  }
}
