const express = require('express')
const { protect } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

const router = express.Router()

// @desc    Upload post media (images/videos)
// @route   POST /api/upload/post
router.post('/post', protect, upload.post.array('media', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No media uploaded' })
    }

    const uploadedMedia = req.files.map((file) => ({
      url: file.path,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
    }))

    res.status(200).json({
      success: true,
      media: uploadedMedia,
    })
  } catch (error) {
    console.error('Post media upload error:', error)
    res.status(500).json({ success: false, message: 'Media upload failed' })
  }
})

// @desc    Upload avatar
// @route   POST /api/upload/avatar
router.post('/avatar', protect, upload.avatar.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' })
    }

    res.status(200).json({
      success: true,
      url: req.file.path,
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({ success: false, message: 'Avatar upload failed' })
  }
})

// @desc    Upload story media
// @route   POST /api/upload/story
router.post('/story', protect, upload.post.single('story'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No media uploaded' })
    }

    res.status(200).json({
      success: true,
      mediaUrl: req.file.path,
      mediaType: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
    })
  } catch (error) {
    console.error('Story upload error:', error)
    res.status(500).json({ success: false, message: 'Story upload failed' })
  }
})

// @desc    Upload message media
// @route   POST /api/upload/message
router.post('/message', protect, upload.message.single('message'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No media uploaded' })
    }

    res.status(200).json({
      success: true,
      url: req.file.path,
      format: req.file.mimetype,
    })
  } catch (error) {
    console.error('Message media upload error:', error)
    res.status(500).json({ success: false, message: 'Message media upload failed' })
  }
})

module.exports = router
