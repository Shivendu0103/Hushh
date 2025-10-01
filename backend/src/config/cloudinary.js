const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary storage for different file types
const createCloudinaryStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `hushh/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      use_filename: true,
      unique_filename: true,
    },
  })
}

// Storage configurations for different file types
const storageConfigs = {
  avatars: createCloudinaryStorage('avatars', ['jpg', 'jpeg', 'png', 'webp']),
  posts: createCloudinaryStorage('posts', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov']),
  messages: createCloudinaryStorage('messages', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'pdf', 'doc', 'docx']),
  covers: createCloudinaryStorage('covers', ['jpg', 'jpeg', 'png', 'webp'])
}

// File filters
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

const mediaFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image and video files are allowed!'), false)
  }
}

// Multer configurations
const upload = {
  avatar: multer({ 
    storage: storageConfigs.avatars, 
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }),
  
  post: multer({ 
    storage: storageConfigs.posts, 
    fileFilter: mediaFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  }),
  
  message: multer({ 
    storage: storageConfigs.messages, 
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
  }),
  
  cover: multer({ 
    storage: storageConfigs.covers, 
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  })
}

// Helper functions
const uploadToCloudinary = async (file, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `hushh/${folder}`,
      use_filename: true,
      unique_filename: true,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`)
  }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`)
  }
}

// Generate optimized URLs
const getOptimizedUrl = (publicId, options = {}) => {
  const { width = 500, height = 500, quality = 'auto', format = 'auto' } = options
  
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality },
      { fetch_format: format }
    ]
  })
}

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
  storageConfigs
}
