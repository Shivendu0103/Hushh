import { useState, useCallback } from 'react'
import { uploadAPI } from '../utils/api'

const useFileUpload = (options = {}) => {
  const { 
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    multiple = false 
  } = options

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Validate file
  const validateFile = useCallback((file) => {
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    return true
  }, [maxSize, allowedTypes])

  // Upload files
  const uploadFiles = useCallback(async (files, uploadType = 'post') => {
    try {
      setUploading(true)
      setError(null)
      setProgress(0)

      const fileArray = Array.from(files)
      
      // Validate all files first
      fileArray.forEach(validateFile)

      let uploadPromise
      
      switch (uploadType) {
        case 'avatar':
          if (fileArray.length > 1) {
            throw new Error('Only one avatar file allowed')
          }
          uploadPromise = uploadAPI.uploadAvatar(fileArray[0])
          break
        
        case 'post':
          uploadPromise = uploadAPI.uploadPostMedia(fileArray)
          break
        
        case 'message':
          if (fileArray.length > 1) {
            throw new Error('Only one message file allowed')
          }
          uploadPromise = uploadAPI.uploadMessageMedia(fileArray[0])
          break
        
        default:
          throw new Error('Invalid upload type')
      }

      // Simulate progress (you can implement real progress tracking)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await uploadPromise
      
      clearInterval(progressInterval)
      setProgress(100)

      const uploadedData = response.data.files || [response.data.file]
      setUploadedFiles(prev => [...prev, ...uploadedData])

      return {
        success: true,
        files: uploadedData
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Upload failed'
      setError(message)
      return {
        success: false,
        error: message
      }
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [validateFile])

  // Clear uploaded files
  const clearFiles = useCallback(() => {
    setUploadedFiles([])
    setError(null)
    setProgress(0)
  }, [])

  // Remove specific file
  const removeFile = useCallback((fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  // Create file preview
  const createPreview = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadedFiles,
    uploadFiles,
    clearFiles,
    removeFile,
    createPreview,
    validateFile
  }
}

export default useFileUpload
