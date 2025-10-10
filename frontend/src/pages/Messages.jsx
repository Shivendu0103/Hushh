import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ArrowLeft, X, UserPlus, Send, Phone, Video, MoreHorizontal } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import LiquidBackground from '../components/ui/LiquidBackground'
import toast from 'react-hot-toast'

// User Search Modal Component
const UserSearchModal = ({ isOpen, onClose, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { isUserOnline } = useSocket()

  // Fetch users from real database
  const searchUsers = async (query = '') => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('hushh_token')}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        console.error('Failed to fetch users')
        setUsers([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Search with debounce
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchTerm)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, isOpen])

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      searchUsers('')
    }
  }, [isOpen])

  const handleSelectUser = (user) => {
    onSelectUser(user)
    onClose()
    setSearchTerm('')
  }

  const formatUser = (user) => ({
    id: user._id,
    name: user.profile?.displayName || user.username,
    username: user.username,
    avatar: user.profile?.avatar,
    bio: user.profile?.bio,
    currentVibe: user.profile?.currentVibe
  })

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-0 w-full max-w-md max-h-[70vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Start New Chat</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or username..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-80">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400">Searching users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchTerm ? 'No users found' : 'Start typing to search users'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm ? `No results for "${searchTerm}"` : 'Find people to chat with'}
              </p>
            </div>
          ) : (
            users.map((user) => {
              const formattedUser = formatUser(user)
              return (
                <motion.div
                  key={formattedUser.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => handleSelectUser(formattedUser)}
                  className="p-4 cursor-pointer border-b border-white/5 transition-all hover:bg-white/5"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                        {formattedUser.avatar ? (
                          <img
                            src={formattedUser.avatar}
                            alt={formattedUser.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {formattedUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      {isUserOnline(formattedUser.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white truncate">
                          {formattedUser.name}
                        </h4>
                        {isUserOnline(formattedUser.id) && (
                          <span className="text-xs text-green-400">Online</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">@{formattedUser.username}</p>
                      {formattedUser.currentVibe && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs mr-1">{formattedUser.currentVibe.emoji}</span>
                          <span className="text-xs text-gray-500">{formattedUser.currentVibe.status}</span>
                        </div>
                      )}
                      {formattedUser.bio && (
                        <p className="text-xs text-gray-500 truncate mt-1">{formattedUser.bio}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Real-time Chat Window Component
const ChatWindow = ({ recipientId, recipientName, recipientAvatar }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const { sendMessage, startTyping, stopTyping, socket, isUserOnline } = useSocket()
  const { user } = useAuth()

  // Load conversation messages from database
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/messages/${recipientId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('hushh_token')}`
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }

    if (recipientId) {
      loadMessages()
    }
  }, [recipientId])

  // Listen for real-time messages
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.senderId === recipientId || newMessage.recipientId === recipientId) {
          setMessages(prev => [...prev, newMessage])
        }
      }

      const handleMessageSent = (data) => {
        if (data.message) {
          setMessages(prev => [...prev, data.message])
        }
      }

      const handleTyping = ({ userId }) => {
        if (userId === recipientId) {
          setTypingUsers(prev => new Set([...prev, userId]))
          setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev)
              newSet.delete(userId)
              return newSet
            })
          }, 3000)
        }
      }

      const handleStoppedTyping = ({ userId }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      }

      socket.on('new_message', handleNewMessage)
      socket.on('message_sent', handleMessageSent)
      socket.on('user_typing', handleTyping)
      socket.on('user_stopped_typing', handleStoppedTyping)

      return () => {
        socket.off('new_message', handleNewMessage)
        socket.off('message_sent', handleMessageSent)
        socket.off('user_typing', handleTyping)
        socket.off('user_stopped_typing', handleStoppedTyping)
      }
    }
  }, [socket, recipientId])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(recipientId, message)
    setMessage('')
    stopTyping(recipientId)
    setIsTyping(false)
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      startTyping(recipientId)
    }
    
    clearTimeout(window.typingTimeout)
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false)
      stopTyping(recipientId)
    }, 1000)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const isOwnMessage = (msg) => {
    return msg.senderId === user?.id || msg.sender?._id === user?.id
  }

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                {recipientAvatar ? (
                  <img
                    src={recipientAvatar}
                    alt={recipientName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {recipientName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {isUserOnline(recipientId) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-white">{recipientName}</h3>
              <p className="text-sm text-gray-400">
                {typingUsers.has(recipientId) ? (
                  <span className="text-green-400">Typing...</span>
                ) : isUserOnline(recipientId) ? (
                  'Online'
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Phone className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Video className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              💬
            </div>
            <p className="text-gray-400">Start your conversation with {recipientName}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg._id || msg.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwnMessage(msg)
                  ? 'neon-gradient text-white' 
                  : 'glass text-white border border-white/20'
              }`}>
                <p className="text-sm break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(msg.timestamp || msg.createdAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
        
        {/* Typing indicator */}
        {typingUsers.has(recipientId) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass px-4 py-2 rounded-2xl border border-white/20">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/60 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 rounded-xl neon-gradient text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

// Main Messages Component
const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null)
  const [conversations, setConversations] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isUserOnline } = useSocket()

  // Load conversations from database
  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('hushh_token')}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      } else {
        console.error('Failed to load conversations')
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setShowChat(true)
  }

  const handleStartNewChat = (user) => {
    const contact = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar
    }
    
    setSelectedContact(contact)
    setShowChat(true)
  }

  const handleBack = () => {
    setShowChat(false)
    setSelectedContact(null)
  }

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv._id
    const name = otherUser.profile?.displayName || otherUser.username
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const formatTime = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = (now - messageTime) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return messageTime.toLocaleDateString()
    }
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[80vh] flex gap-6"
        >
          {/* Conversations List */}
          <div className={`w-full lg:w-1/3 ${showChat ? 'hidden lg:block' : 'block'}`}>
            <div className="glass rounded-2xl h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Messages</h2>
                  <button 
                    onClick={() => setShowUserSearch(true)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <p className="text-gray-400 mb-2">No conversations yet</p>
                    <button
                      onClick={() => setShowUserSearch(true)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Start your first chat
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = conversation._id
                    const lastMessage = conversation.lastMessage
                    const contact = {
                      id: otherUser._id,
                      name: otherUser.profile?.displayName || otherUser.username,
                      username: otherUser.username,
                      avatar: otherUser.profile?.avatar
                    }

                    return (
                      <motion.div
                        key={conversation._id._id}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        onClick={() => handleSelectContact(contact)}
                        className={`p-4 cursor-pointer border-b border-white/5 transition-all ${
                          selectedContact?.id === contact.id ? 'bg-purple-500/20' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
                              {contact.avatar ? (
                                <img
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    {contact.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {isUserOnline(contact.id) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {contact.name}
                              </h3>
                              <span className="text-xs text-gray-400">
                                {lastMessage && formatTime(lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-400 truncate">
                                {lastMessage?.content || 'Start conversation...'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className={`w-full lg:w-2/3 ${!showChat ? 'hidden lg:flex lg:items-center lg:justify-center' : 'block'}`}>
            {selectedContact ? (
              <div className="h-full flex flex-col">
                {/* Mobile Back Button */}
                <div className="lg:hidden flex items-center p-4 glass rounded-t-2xl">
                  <button
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors mr-3"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedContact.name}
                  </h3>
                </div>

                {/* Real-time Chat Window */}
                <div className="flex-1">
                  <ChatWindow
                    recipientId={selectedContact.id}
                    recipientName={selectedContact.name}
                    recipientAvatar={selectedContact.avatar}
                  />
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  💬
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400 mb-4">
                  Choose from your existing conversations or start a new one
                </p>
                <button
                  onClick={() => setShowUserSearch(true)}
                  className="neon-gradient px-6 py-2 rounded-xl text-white hover:shadow-lg transition-all"
                >
                  Start New Chat
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* User Search Modal */}
      <UserSearchModal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onSelectUser={handleStartNewChat}
      />
    </div>
  )
}

export default Messages
