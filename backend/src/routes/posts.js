const express = require('express')
const { protect } = require('../middleware/auth')
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentPost,
  deletePost
} = require('../controllers/postController')

const router = express.Router()

router.route('/')
  .get(getAllPosts)
  .post(protect, createPost)

router.route('/user/:userId').get(getUserPosts)
router.route('/:id').delete(protect, deletePost)
router.route('/:id/like').post(protect, likePost)
router.route('/:id/comment').post(protect, commentPost)

module.exports = router
