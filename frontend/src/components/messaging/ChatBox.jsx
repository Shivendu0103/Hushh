import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, Info, ArrowLeft } from 'lucide-react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const ChatBox = ({ contact, messages, onSendMessage, onBack }) => {
  const [replyTo, setReplyTo] = useState(null)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (messageData) => {
    onSendMessage({
      ...messageData,
      id: Date.now(),
      sender: { username: 'current_user', avatar: '/default-avatar.png' },
      read: false
    })
    setReplyTo(null)
  }

  if (!contact) {
    return (
      <GlassCard className="h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            💬
          </motion.div>
          <h3 className="text-xl font-bold neon-text mb-2">Select a chat</h3>
          <p className="text-gray-400">Choose a conversation to start vibing!</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="lg:hidden p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={contact.avatar || "/default-avatar.png"}
                alt={contact.name}
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
            
            <div>
              <h3 className="font-bold text-white">{contact.name}</h3>
              <p className="text-sm text-gray-400">
                {contact.isOnline ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Online
                  </span>
                ) : (
                  `Last seen ${new Date(contact.lastSeen).toLocaleDateString()}`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <NeonButton variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </NeonButton>
            <NeonButton variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </NeonButton>
            <NeonButton variant="ghost" size="sm">
              <Info className="w-4 h-4" />
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender.username === 'current_user'}
              onReact={(messageId, emoji) => console.log('React:', messageId, emoji)}
              onReply={(msg) => setReplyTo(msg)}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5">
              <img src={contact.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="glass px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/60 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </GlassCard>
  )
}

export default ChatBox
