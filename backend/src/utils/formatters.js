// Format time ago
export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 60) return 'now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`
  return time.toLocaleDateString()
}

// Format number with K/M suffixes
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format XP with level calculation
export const formatXP = (xp) => {
  const calculateLevel = (xp) => {
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
      progress: ((xp - totalXP) / requiredXP * 100)
    }
  }
  
  return calculateLevel(xp)
}

// Format username mention
export const formatMentions = (text) => {
  return text.replace(/@(\w+)/g, '<span class="text-purple-400 font-semibold">@$1</span>')
}

// Format hashtags
export const formatHashtags = (text) => {
  return text.replace(/#(\w+)/g, '<span class="text-blue-400 font-semibold">#$1</span>')
}

// Format phone number
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Generate initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Generate color from string
export const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

// Format date range
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString()
  }
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

export default {
  formatTimeAgo,
  formatNumber,
  formatFileSize,
  formatXP,
  formatMentions,
  formatHashtags,
  formatPhone,
  formatCurrency,
  truncateText,
  capitalize,
  getInitials,
  stringToColor,
  formatDateRange
}
