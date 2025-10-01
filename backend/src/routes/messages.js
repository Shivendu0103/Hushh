const express = require('express')
const { protect } = require('../middleware/auth')
const {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  deleteMessage,
  addReaction
} = require('../controllers/messageController')

const router = express.Router()

// All routes protected
router.use(protect)

router.route('/')
  .get(getConversations)
  .post(sendMessage)

router.route('/:userId')
  .get(getMessages)

router.route('/:messageId/read')
  .patch(markAsRead)

router.route('/:messageId/react')
  .post(addReaction)

router.route('/:messageId')
  .delete(deleteMessage)

module.exports = router
