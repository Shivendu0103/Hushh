import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Smile, Phone, Video, MoreHorizontal } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

const ChatWindow = ({ recipientId, recipientName, recipientAvatar }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const messagesEndRef = useRef(null)
  
  const { sendMessage, startTyping, stopTyping, socket } = useSocket()

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Listen for real-time messages
  useEffect(() => {
    if (socket) {
      socket.on('new_message', (newMessage) => {
        if (newMessage.senderId === recipientId || newMessage.recipientId === recipientId) {
          setMessages(prev => [...prev, newMessage])
        }
      })

      socket.on('message_sent', (data) => {
        if (data.message) {
          setMessages(prev => [...prev, data.message])
        }
      })

      socket.on('user_typing', ({ userId }) => {
        if (userId === recipientId) {
          setTypingUsers(prev => new Set([...prev, userId]))
        }
      })

      socket.on('user_stopped_typing', ({ userId }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      return () => {
        socket.off('new_message')
        socket.off('message_sent')
        socket.off('user_typing')
        socket.off('user_stopped_typing')
      }
    }
  }, [socket, recipientId])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Send message via socket
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
    
    // Auto stop typing after 1 second
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

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
              <img
                src={recipientAvatar || "/default-avatar.png"}
                alt={recipientName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-white">{recipientName}</h3>
              <p className="text-sm text-gray-400">
                {typingUsers.has(recipientId) ? 'Typing...' : 'Online'}
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
          messages.map((msg, index) => {
            const isOwnMessage = msg.senderId !== recipientId
            return (
              <motion.div
                key={msg._id || msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage 
                    ? 'neon-gradient text-white' 
                    : 'glass text-white border border-white/20'
                }`}>
                  <p className="text-sm break-words">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            )
          })
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
          
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

export default ChatWindow
