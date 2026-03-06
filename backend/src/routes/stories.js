const express = require('express')
const { protect } = require('../middleware/auth')
const {
    createStory,
    getActiveStories,
    viewStory,
    deleteStory
} = require('../controllers/storyController')

const router = express.Router()

router.route('/')
    .get(protect, getActiveStories)
    .post(protect, createStory)

router.route('/:id')
    .delete(protect, deleteStory)

router.route('/:id/view')
    .post(protect, viewStory)

module.exports = router
