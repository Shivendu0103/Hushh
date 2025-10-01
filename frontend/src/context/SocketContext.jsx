import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [notifications, setNotifications] = useState([])
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true
      })

      newSocket.on('connect', () => {
        console.log('🔗 Connected to Hushh servers!')
        toast.success('🔗 Connected to Hushh!')
        
        // Join user room
        newSocket.emit('user_join', user.id)
      })

      // Real-time user status
      newSocket.on('user_online', (userId) => {
        setOnlineUsers(prev => new Set([...prev, userId]))
      })

      newSocket.on('user_offline', (userId) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      // Real-time notifications
      newSocket.on('new_notification', (notification) => {
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

      // Real-time message notifications
      newSocket.on('new_message', (message) => {
        // Handle new message (will be used in messaging components)
        toast.success(`💬 New message from ${message.sender.displayName}`)
      })

      // Real-time post reactions
      newSocket.on('new_reaction', (reaction) => {
        toast.success('Someone reacted to your post! 🔥')
      })

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from Hushh servers')
        toast.error('🔌 Connection lost')
      })

      setSocket(newSocket)

      return () => {
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
    if (socket) {
      socket.emit('send_message', {
        recipientId,
        senderId: user.id,
        content,
        type,
        sender: {
          id: user.id,
          username: user.username,
          displayName: user.profile?.displayName || user.username,
          avatar: user.profile?.avatar
        }
      })
    }
  }

  const sendPostReaction = (postId, reaction, postAuthorId) => {
    if (socket) {
      socket.emit('post_reaction', {
        postId,
        userId: user.id,
        reaction,
        postAuthorId
      })
    }
  }

  const startTyping = (recipientId) => {
    if (socket) {
      socket.emit('typing_start', {
        recipientId,
        senderId: user.id
      })
    }
  }

  const stopTyping = (recipientId) => {
    if (socket) {
      socket.emit('typing_stop', {
        recipientId, 
        senderId: user.id
      })
    }
  }

  const sendNotification = (recipientId, type, message) => {
    if (socket) {
      socket.emit('send_notification', {
        recipientId,
        type,
        message,
        senderId: user.id
      })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        notifications,
        sendMessage,
        sendPostReaction,
        startTyping,
        stopTyping,
        sendNotification,
        isUserOnline: (userId) => onlineUsers.has(userId)
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
