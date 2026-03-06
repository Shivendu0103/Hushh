const Story = require('../models/Story')
const User = require('../models/User')

// @desc    Create new story
// @route   POST /api/stories
const createStory = async (req, res) => {
    try {
        const { mediaUrl, mediaType = 'image' } = req.body

        if (!mediaUrl) {
            return res.status(400).json({
                success: false,
                message: 'Media URL is required for a story'
            })
        }

        // Story expires in 24 hours
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        const story = await Story.create({
            author: req.user.id,
            mediaUrl,
            mediaType,
            expiresAt
        })

        await story.populate('author', 'username profile')

        // Broadcast to connected users
        req.io.emit('new_story', {
            id: story._id,
            author: {
                id: story.author._id,
                username: story.author.username,
                avatar: story.author.profile?.avatar
            },
            mediaUrl: story.mediaUrl,
            mediaType: story.mediaType,
            expiresAt: story.expiresAt
        })

        res.status(201).json({
            success: true,
            message: 'Story added successfully!',
            story
        })
    } catch (error) {
        console.error('Create story error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error creating story'
        })
    }
}

// @desc    Get active stories (grouped by user)
// @route   GET /api/stories
const getActiveStories = async (req, res) => {
    try {
        const stories = await Story.find({ expiresAt: { $gt: new Date() } })
            .populate('author', 'username profile')
            .sort({ createdAt: 1 })

        // Group stories by author
        const groupedStories = {}

        stories.forEach(story => {
            const authorId = story.author._id.toString()
            if (!groupedStories[authorId]) {
                groupedStories[authorId] = {
                    author: {
                        id: story.author._id,
                        username: story.author.username,
                        avatar: story.author.profile?.avatar
                    },
                    stories: []
                }
            }
            groupedStories[authorId].stories.push({
                id: story._id,
                mediaUrl: story.mediaUrl,
                mediaType: story.mediaType,
                createdAt: story.createdAt,
                expiresAt: story.expiresAt,
                views: story.views.length,
                viewedByUser: req.user ? story.views.some(v => v.user.toString() === req.user.id) : false
            })
        })

        res.json({
            success: true,
            users: Object.values(groupedStories)
        })
    } catch (error) {
        console.error('Get stories error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error fetching stories'
        })
    }
}

// @desc    Mark story as viewed
// @route   POST /api/stories/:id/view
const viewStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            })
        }

        const hasViewed = story.views.some(v => v.user.toString() === req.user.id)

        if (!hasViewed) {
            story.views.push({ user: req.user.id })
            await story.save()
        }

        res.json({
            success: true,
            message: 'Story marked as viewed'
        })
    } catch (error) {
        console.error('View story error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

// @desc    Delete a story
// @route   DELETE /api/stories/:id
const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            })
        }

        if (story.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this story'
            })
        }

        await story.deleteOne()

        req.io.emit('story_deleted', {
            storyId: req.params.id,
            userId: req.user.id
        })

        res.json({
            success: true,
            message: 'Story deleted'
        })
    } catch (error) {
        console.error('Delete story error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

module.exports = {
    createStory,
    getActiveStories,
    viewStory,
    deleteStory
}
