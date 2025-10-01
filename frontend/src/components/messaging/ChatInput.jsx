import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Image, Mic, X, Zap } from 'lucide-react'
import NeonButton from '../ui/NeonButton'

const ChatInput = ({ onSendMessage, replyTo, onCancelReply, disabled = false }) => {
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef(null)

  const emojis = [
    '😀', '😂', '😍', '🤔', '😭', '😡', '👍', '👎', 
    '🔥', '✨', '💯', '🚀', '💜', '🌈', '⚡', '🌟'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    onSendMessage({
      content: message.trim(),
      replyTo: replyTo || null,
      timestamp: new Date(),
      type: 'text'
    })

    setMessage('')
    onCancelReply?.()
    inputRef.current?.focus()
  }

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji)
    setShowEmojis(false)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="glass backdrop-blur-lg border-t border-white/20 p-4">
      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-white/10 rounded-lg border-l-4 border-purple-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-400 font-medium">
                  Replying to @{replyTo.sender.username}
                </p>
                <p className="text-sm text-gray-300 truncate mt-1">
                  {replyTo.content}
                </p>
              </div>
              <button
                onClick={onCancelReply}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 glass p-3 rounded-xl"
          >
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl p-2 rounded-lg hover:bg-white/20 transition-all"
                  style={{ animationDelay: `${index * 25}ms` }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Media Buttons */}
        <div className="flex space-x-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-blue-400 transition-all"
            title="Attach Image"
          >
            <Image className="w-5 h-5" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-all ${
              showEmojis 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-yellow-400'
            }`}
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </motion.button>

          <motion.button
            type="button"
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-white/10 hover:bg-white/20 text-red-400'
            }`}
            title="Voice Message"
          >
            <Mic className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Connecting..." : "Type your vibe..."}
            disabled={disabled}
            className="
              w-full px-4 py-3 pr-12 rounded-2xl resize-none
              bg-white/10 backdrop-blur-lg border border-white/20
              text-white placeholder-gray-400
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
              transition-all duration-300 max-h-32
            "
            rows={1}
            style={{ 
              height: 'auto',
              minHeight: '48px',
              maxHeight: '128px'
            }}
          />

          {/* Character Counter */}
          {message.length > 200 && (
            <div className="absolute bottom-1 right-12 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>

        {/* Send Button */}
        <NeonButton
          type="submit"
          disabled={!message.trim() || disabled}
          size="sm"
          className="px-4 py-3"
          icon={<Send className="w-4 h-4" />}
        >
          <span className="sr-only">Send</span>
        </NeonButton>
      </form>

      {/* Voice Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-3 flex items-center justify-center space-x-2 text-red-400"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-sm font-medium">Recording voice message...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatInput
