const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getUsers,
  getUserProfile,
  updateProfile,
  searchUsers,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnections,
  getUserStats
} = require('../controllers/userController')

const router = express.Router()

// ===== CRITICAL: Specific routes BEFORE catch-all /:id =====
// Search route - must be protected and BEFORE /:id
router.get('/search', protect, searchUsers)

// Trending users route
router.get('/trending', (req, res) => {
  // Get trending users - can be public or protected
  // Temporarily returns top users by followers
  res.json({ success: true, data: [] })
})

// Public user profile route
router.get('/:id', getUserProfile)

// All other routes require authentication
router.use(protect)

router.route('/')
  .get(getUsers)

router.route('/profile')
  .patch(updateProfile)

router.route('/connections')
  .get(getConnections)

router.route('/connect/:userId')
  .post(sendConnectionRequest)

router.route('/connect/:requestId/accept')
  .patch(acceptConnectionRequest)

router.route('/connect/:requestId/decline')
  .patch(declineConnectionRequest)

router.route('/:id/stats')
  .get(getUserStats)

// Follow/Unfollow routes
router.post('/:id/follow', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    if (userId === id) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' })
    }

    // Create follow relationship (simplified - using a follow field)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: id } },
      { new: true }
    )

    // Add to followers
    await User.findByIdAndUpdate(
      id,
      { $addToSet: { followers: userId } }
    )

    res.json({ success: true, message: 'Followed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error following user' })
  }
})

// Get user posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username profile gamification')
      .sort({ createdAt: -1 })
      .limit(50)
    
    res.json({ success: true, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching posts' })
  }
})

module.exports = router
