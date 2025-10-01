import { motion } from 'framer-motion'
import { Check, CheckCheck, Heart, Reply } from 'lucide-react'
import { useState } from 'react'

const MessageBubble = ({ message, isOwn, onReact, onReply }) => {
  const [showReactions, setShowReactions] = useState(false)
  const [hovering, setHovering] = useState(false)

  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥', '✨']

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {!isOwn && (
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={message.sender.avatar || "/default-avatar.png"}
              alt={message.sender.username}
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        )}

        {/* Message Container */}
        <div className="relative">
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.8 }}
            className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex space-x-1 z-10`}
          >
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="glass p-1 rounded-full hover:bg-white/20 transition-all"
            >
              <Heart className="w-4 h-4 text-pink-400" />
            </button>
            <button
              onClick={() => onReply?.(message)}
              className="glass p-1 rounded-full hover:bg-white/20 transition-all"
            >
              <Reply className="w-4 h-4 text-blue-400" />
            </button>
          </motion.div>

          {/* Reactions Picker */}
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className={`absolute ${isOwn ? 'right-0' : 'left-0'} bottom-full mb-2 glass p-2 rounded-xl flex space-x-1 z-20`}
            >
              {reactions.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onReact?.(message.id, emoji)
                    setShowReactions(false)
                  }}
                  className="text-lg hover:bg-white/20 rounded-lg p-1 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
              relative px-4 py-3 rounded-2xl max-w-full break-words
              ${isOwn 
                ? 'neon-gradient text-white' 
                : 'glass backdrop-blur-lg text-white border border-white/20'
              }
            `}
          >
            {/* Reply to indicator */}
            {message.replyTo && (
              <div className="mb-2 p-2 bg-black/20 rounded-lg border-l-2 border-purple-500">
                <p className="text-xs text-gray-400">@{message.replyTo.sender.username}</p>
                <p className="text-sm text-gray-300 truncate">{message.replyTo.content}</p>
              </div>
            )}

            {/* Message Content */}
            <p className="text-sm leading-relaxed">{message.content}</p>

            {/* Message reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-black/30 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-300">{reaction.count}</span>
                  </motion.span>
                ))}
              </div>
            )}

            {/* Message tail */}
            <div className={`
              absolute top-3 w-3 h-3 transform rotate-45
              ${isOwn 
                ? 'right-0 translate-x-1/2 bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'left-0 -translate-x-1/2 glass border border-white/20'
              }
            `} />
          </motion.div>

          {/* Message Info */}
          <div className={`flex items-center space-x-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            
            {/* Read status for own messages */}
            {isOwn && (
              <div className="text-xs text-gray-400">
                {message.read ? (
                  <CheckCheck className="w-4 h-4 text-blue-400" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
