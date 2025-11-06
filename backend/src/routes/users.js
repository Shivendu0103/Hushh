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

module.exports = router
