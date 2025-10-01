const express = require('express')
const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { registerValidation, loginValidation } = require('../middleware/validation')

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.get('/me', protect, getMe)

module.exports = router
