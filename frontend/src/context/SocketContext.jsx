import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Map())
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔗 Initializing socket connection for user:', user)
      
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      // Connection events
      newSocket.on('connect', () => {
        console.log('🔗 Connected to Hushh servers!', newSocket.id)
        toast.success('🔗 Connected to Hushh!')
        
        // Join user room with proper user ID
        const userId = user.id || user._id
        console.log('👋 Joining user room:', userId)
        newSocket.emit('user_join', userId)
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error)
        toast.error('Connection failed: ' + error.message)
      })

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from Hushh servers:', reason)
        toast.error('🔌 Connection lost: ' + reason)
      })

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected to server, attempt:', attemptNumber)
        toast.success('🔄 Reconnected!')
      })

      // Real-time user status
      newSocket.on('user_online', (userId) => {
        console.log('👋 User came online:', userId)
        setOnlineUsers(prev => new Set([...prev, userId]))
      })

      newSocket.on('user_offline', (userId) => {
        console.log('👋 User went offline:', userId)
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      // Real-time messaging events
      newSocket.on('new_message', (message) => {
        console.log('💬 New message received:', message)
        setMessages(prev => [...prev, message])
        
        if (message.sender && message.sender.id !== (user.id || user._id)) {
          toast.success(`💬 New message from ${message.sender.displayName || message.sender.username}`)
        }
      })

      newSocket.on('message_sent', (data) => {
        console.log('✅ Message sent confirmation:', data)
        if (data.message) {
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.find(m => m._id === data.message._id || m.id === data.message.id)
            if (exists) return prev
            return [...prev, data.message]
          })
        }
      })

      newSocket.on('message_error', (error) => {
        console.error('❌ Message error:', error)
        toast.error(`Message failed: ${error.error}`)
      })

      newSocket.on('message_read', (data) => {
        console.log('👁️ Message read:', data)
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, read: true } : msg
        ))
      })

      // Typing indicators
      newSocket.on('user_typing', ({ userId }) => {
        console.log('⌨️ User typing:', userId)
        setTypingUsers(prev => {
          const newMap = new Map(prev)
          newMap.set(userId, Date.now())
          return newMap
        })

        // Auto-clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => {
            const newMap = new Map(prev)
            newMap.delete(userId)
            return newMap
          })
        }, 3000)
      })

      newSocket.on('user_stopped_typing', ({ userId }) => {
        console.log('⌨️ User stopped typing:', userId)
        setTypingUsers(prev => {
          const newMap = new Map(prev)
          newMap.delete(userId)
          return newMap
        })
      })

      // Real-time notifications
      newSocket.on('new_notification', (notification) => {
        console.log('🔔 New notification:', notification)
        setNotifications(prev => [notification, ...prev])
        
        // Show toast notification
        toast.success(
          `${notification.message}`,
          {
            icon: getNotificationIcon(notification.type),
            duration: 3000
          }
        )
      })

      // Real-time post reactions
      newSocket.on('new_reaction', (reaction) => {
        console.log('❤️ New reaction:', reaction)
        toast.success('Someone reacted to your post! 🔥')
      })

      newSocket.on('post_updated', (update) => {
        console.log('📝 Post updated:', update)
      })

      setSocket(newSocket)

      return () => {
        console.log('🔌 Cleaning up socket connection')
        newSocket.close()
      }
    }
  }, [isAuthenticated, user])

  const getNotificationIcon = (type) => {
    const icons = {
      like: '❤️',
      comment: '💬', 
      follow: '👥',
      message: '📱',
      achievement: '🏆'
    }
    return icons[type] || '🔔'
  }

  // Socket helper functions
  const sendMessage = (recipientId, content, type = 'text') => {
    if (!socket) {
      console.error('❌ Socket not connected')
      toast.error('Not connected to server')
      return false
    }

    if (!socket.connected) {
      console.error('❌ Socket disconnected')
      toast.error('Connection lost. Trying to reconnect...')
      return false
    }

    if (!user) {
      console.error('❌ User not authenticated')
      toast.error('Please login again')
      return false
    }

    if (!content || !content.trim()) {
      console.error('❌ Message content is empty')
      return false
    }

    const messageData = {
      recipientId,
      senderId: user.id || user._id,
      content: content.trim(),
      type,
      sender: {
        id: user.id || user._id,
        username: user.username,
        displayName: user.profile?.displayName || user.username,
        avatar: user.profile?.avatar
      }
    }

    console.log('📤 Sending message via socket:', messageData)

    // Add the message to local state immediately for better UX
    const tempMessage = {
      id: Date.now(),
      _id: Date.now(),
      senderId: user.id || user._id,
      recipientId,
      content: content.trim(),
      type,
      timestamp: new Date().toISOString(),
      status: 'sending',
      sender: messageData.sender
    }

    setMessages(prev => [...prev, tempMessage])

    socket.emit('send_message', messageData)
    return true
  }

  const sendPostReaction = (postId, reaction, postAuthorId) => {
    if (socket && socket.connected) {
      console.log('❤️ Sending post reaction:', { postId, reaction, postAuthorId })
      socket.emit('post_reaction', {
        postId,
        userId: user.id || user._id,
        reaction,
        postAuthorId
      })
    }
  }

  const startTyping = (recipientId) => {
    if (socket && socket.connected && recipientId) {
      console.log('⌨️ Started typing to:', recipientId)
      socket.emit('typing_start', {
        recipientId,
        senderId: user.id || user._id
      })
    }
  }

  const stopTyping = (recipientId) => {
    if (socket && socket.connected && recipientId) {
      console.log('⌨️ Stopped typing to:', recipientId)
      socket.emit('typing_stop', {
        recipientId, 
        senderId: user.id || user._id
      })
    }
  }

  const sendNotification = (recipientId, type, message) => {
    if (socket && socket.connected) {
      console.log('🔔 Sending notification:', { recipientId, type, message })
      socket.emit('send_notification', {
        recipientId,
        type,
        message,
        senderId: user.id || user._id
      })
    }
  }

  const markMessageAsRead = (messageId) => {
    if (socket && socket.connected) {
      console.log('👁️ Marking message as read:', messageId)
      socket.emit('mark_message_read', {
        messageId,
        userId: user.id || user._id
      })
    }
  }

  // Get messages for a specific conversation
  const getConversationMessages = (userId) => {
    return messages.filter(msg => 
      (msg.senderId === userId && msg.recipientId === (user.id || user._id)) ||
      (msg.senderId === (user.id || user._id) && msg.recipientId === userId)
    )
  }

  // Clear messages (useful for debugging)
  const clearMessages = () => {
    setMessages([])
  }

  // Connection status
  const connectionStatus = {
    connected: socket?.connected || false,
    connecting: socket?.connecting || false,
    disconnected: socket?.disconnected || true
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        notifications,
        messages,
        typingUsers,
        sendMessage,
        sendPostReaction,
        startTyping,
        stopTyping,
        sendNotification,
        markMessageAsRead,
        getConversationMessages,
        clearMessages,
        isUserOnline: (userId) => onlineUsers.has(userId),
        isUserTyping: (userId) => typingUsers.has(userId),
        isConnected: socket?.connected || false,
        connectionStatus
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}
