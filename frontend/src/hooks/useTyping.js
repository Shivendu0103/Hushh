import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { useDebouncedCallback } from './useDebounce'

const useTyping = (recipientId) => {
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const { socket, useSocketListener } = useSocket()

  // Debounced stop typing
  const debouncedStopTyping = useDebouncedCallback(() => {
    setIsTyping(false)
    if (socket && recipientId) {
      socket.emit('typing_stop', { recipientId })
    }
  }, 1000)

  // Start typing
  const startTyping = useCallback(() => {
    if (!isTyping && socket && recipientId) {
      setIsTyping(true)
      socket.emit('typing_start', { recipientId })
    }
    debouncedStopTyping()
  }, [isTyping, socket, recipientId, debouncedStopTyping])

  // Stop typing immediately
  const stopTyping = useCallback(() => {
    setIsTyping(false)
    if (socket && recipientId) {
      socket.emit('typing_stop', { recipientId })
    }
  }, [socket, recipientId])

  // Listen for typing events
  useSocketListener('user_typing', ({ userId }) => {
    setTypingUsers(prev => new Set([...prev, userId]))
  })

  useSocketListener('user_stopped_typing', ({ userId }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
  })

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTyping) {
        stopTyping()
      }
    }
  }, [isTyping, stopTyping])

  return {
    isTyping,
    typingUsers: Array.from(typingUsers),
    startTyping,
    stopTyping,
    isOtherUserTyping: typingUsers.size > 0
  }
}

export default useTyping
