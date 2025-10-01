import { motion } from 'framer-motion'
import { Search, Plus, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../ui/GlassCard'

const ContactList = ({ contacts, selectedContact, onSelectContact, onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatLastMessageTime = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'now'
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  return (
    <GlassCard className="h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold neon-text">Messages</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNewChat}
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="
              w-full pl-10 pr-4 py-2 rounded-lg
              bg-white/10 border border-white/20
              text-white placeholder-gray-400
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
              transition-all duration-300
            "
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectContact(contact)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all duration-300
                  ${selectedContact?.id === contact.id
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with status */}
                  <div className="relative">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={contact.avatar || "/default-avatar.png"}
                        alt={contact.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </motion.div>
                    
                    {/* Online status */}
                    {contact.isOnline && (
                      <motion.div
                        className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {formatLastMessageTime(contact.lastMessage?.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate pr-2">
                        {contact.lastMessage?.content || 'No messages yet'}
                      </p>
                      
                      {/* Unread count */}
                      {contact.unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                        >
                          {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* More options */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle more options
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default ContactList
