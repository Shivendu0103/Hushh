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

    const filter = req.query.author ? { author: req.query.author } : {}

    const posts = await Post.find(filter)
      .populate('author', 'username profile')
      .populate('comments.author', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPosts = await Post.countDocuments(filter)

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
        comments: post.comments,
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

// @desc    Share post
// @route   POST /api/posts/:id/share
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    if (!post.shares) post.shares = 0;
    post.shares += 1;
    await post.save()

    // Award XP to post author
    await User.findByIdAndUpdate(post.author, {
      $inc: { 'gamification.xp': 10 }
    })

    // Broadcast real-time update
    req.io.emit('post_updated', {
      postId: post._id,
      type: 'share',
      shares: post.shares
    })

    res.json({
      success: true,
      message: 'Post shared successfully!',
      shares: post.shares
    })

  } catch (error) {
    console.error('Share post error:', error)
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
  sharePost,
  commentPost: async (req, res) => {
    try {
      const { content } = req.body

      const post = await Post.findById(req.params.id)

      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' })
      }

      const newComment = {
        author: req.user.id,
        content,
        createdAt: new Date()
      }

      post.comments.push(newComment)
      await post.save()

      // Send to post author if not the commenter
      if (post.author.toString() !== req.user.id) {
        req.io.to(`user_${post.author}`).emit('new_notification', {
          id: Date.now(),
          type: 'comment',
          message: `${req.user.username} commented on your post`,
          senderId: req.user.id,
          postId: post._id,
          timestamp: new Date(),
          read: false
        })
      }

      // Populate commenter info before broadcasting
      await post.populate('comments.author', 'username profile')
      const addedComment = post.comments[post.comments.length - 1]

      req.io.emit('post_updated', {
        postId: post._id,
        type: 'comment',
        comment: addedComment,
        commentsCount: post.comments.length
      })

      res.json({ success: true, message: 'Comment added', comment: addedComment })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: 'Server error adding comment' })
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)

      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' })
      }

      // Ensure user is author
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' })
      }

      await post.deleteOne()

      req.io.emit('post_deleted', { postId: post._id })

      res.json({ success: true, message: 'Post deleted successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: 'Server error deleting post' })
    }
  }
}
