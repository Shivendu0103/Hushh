const express = require('express')
const { protect } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

const router = express.Router()

// @desc    Upload post media (images/videos)
// @route   POST /api/upload/post
router.post('/post', protect, (req, res, next) => {
  upload.post.array('media', 5)(req, res, (err) => {
    if (err) {
      console.error('[v0] Upload middleware error:', err)
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' })
    }
    next()
  })
}, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No media uploaded' })
    }

    const uploadedMedia = req.files.map((file) => ({
      url: file.path || file.secure_url,
      type: file.mimetype?.startsWith('video/') ? 'video' : 'image',
    }))

    res.status(200).json({
      success: true,
      media: uploadedMedia,
    })
  } catch (error) {
    console.error('[v0] Post media upload error:', error)
    res.status(500).json({ success: false, message: 'Media upload failed: ' + error.message })
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
router.post('/story', protect, (req, res, next) => {
  upload.post.single('story')(req, res, (err) => {
    if (err) {
      console.error('[v0] Story upload middleware error:', err)
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' })
    }
    next()
  })
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No media uploaded' })
    }

    const mediaUrl = req.file.path || req.file.secure_url
    const mediaType = req.file.mimetype?.startsWith('video/') ? 'video' : 'image'
    
    res.status(200).json({
      success: true,
      mediaUrl,
      mediaType,
    })
  } catch (error) {
    console.error('[v0] Story upload error:', error)
    res.status(500).json({ success: false, message: 'Story upload failed: ' + error.message })
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
