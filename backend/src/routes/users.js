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

// Public routes
router.get('/search', searchUsers)
router.get('/:id', getUserProfile)

// Protected routes
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
