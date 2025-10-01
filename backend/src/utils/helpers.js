const crypto = require('crypto')

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

// Generate random number
const generateRandomNumber = (min = 1000, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate username format
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Sanitize string
const sanitizeString = (str) => {
  if (!str) return ''
  return str.trim().replace(/[<>]/g, '')
}

// Format time ago
const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}

// Paginate results
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  
  const results = {}
  
  if (endIndex < data.length) {
    results.next = { page: page + 1, limit }
  }
  
  if (startIndex > 0) {
    results.previous = { page: page - 1, limit }
  }
  
  results.data = data.slice(startIndex, endIndex)
  results.total = data.length
  results.pages = Math.ceil(data.length / limit)
  results.currentPage = page
  
  return results
}

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Calculate XP for level
const calculateLevelFromXP = (xp) => {
  // Level progression: 100, 250, 500, 1000, 1750, 2750, 4000, etc.
  let level = 1
  let requiredXP = 100
  let totalXP = 0
  
  while (totalXP + requiredXP <= xp) {
    totalXP += requiredXP
    level++
    requiredXP = Math.floor(requiredXP * 1.5)
  }
  
  return {
    level,
    currentLevelXP: xp - totalXP,
    nextLevelXP: requiredXP,
    progress: ((xp - totalXP) / requiredXP * 100).toFixed(1)
  }
}

// Generate color from string
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

// Compress text
const compressText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Parse mention from text
const parseMentions = (text) => {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }
  
  return mentions
}

// Parse hashtags from text
const parseHashtags = (text) => {
  const hashtagRegex = /#(\w+)/g
  const hashtags = []
  let match
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1])
  }
  
  return hashtags
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now()
  const random = generateRandomString(8)
  const extension = originalName.split('.').pop()
  
  return `${timestamp}_${random}.${extension}`
}

// Validate file type
const isValidFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype)
}

// Rate limiting helper
const createRateLimiter = (windowMs, maxRequests) => {
  const requests = new Map()
  
  return (identifier) => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean old entries
    for (const [key, timestamps] of requests.entries()) {
      requests.set(key, timestamps.filter(time => time > windowStart))
      if (requests.get(key).length === 0) {
        requests.delete(key)
      }
    }
    
    // Check current identifier
    const userRequests = requests.get(identifier) || []
    
    if (userRequests.length >= maxRequests) {
      return false // Rate limit exceeded
    }
    
    userRequests.push(now)
    requests.set(identifier, userRequests)
    
    return true // Request allowed
  }
}

module.exports = {
  generateRandomString,
  generateRandomNumber,
  isValidEmail,
  isValidUsername,
  sanitizeString,
  formatTimeAgo,
  paginate,
  generateSlug,
  calculateLevelFromXP,
  stringToColor,
  compressText,
  parseMentions,
  parseHashtags,
  formatFileSize,
  generateUniqueFilename,
  isValidFileType,
  createRateLimiter
}
