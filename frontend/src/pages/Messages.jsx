import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ContactList from '../components/messaging/ContactList'
import ChatBox from '../components/messaging/ChatBox'
import LiquidBackground from '../components/ui/LiquidBackground'

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null)
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [showChat, setShowChat] = useState(false)

  // Sample contacts data
  const sampleContacts = [
    {
      id: 1,
      name: 'Vibe Master',
      username: 'vibe_master',
      avatar: '/default-avatar.png',
      isOnline: true,
      lastSeen: new Date(),
      unreadCount: 3,
      lastMessage: {
        content: "Yo! Check out this new beat I made 🔥",
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    },
    {
      id: 2,
      name: 'Cosmic Dreamer',
      username: 'cosmic_dreamer',
      avatar: '/default-avatar.png',
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      lastMessage: {
        content: "The stars are calling... ✨🌌",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    },
    {
      id: 3,
      name: 'Chaos Queen',
      username: 'chaos_queen',
      avatar: '/default-avatar.png',
      isOnline: true,
      lastSeen: new Date(),
      unreadCount: 1,
      lastMessage: {
        content: "CHAOS MODE ACTIVATED! 🌈⚡",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    }
  ]

  // Sample messages
  const sampleMessages = {
    1: [
      {
        id: 1,
        sender: { username: 'vibe_master', avatar: '/default-avatar.png' },
        content: "Yo! Check out this new beat I made 🔥",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: true,
        reactions: [{ emoji: '🔥', count: 2 }]
      },
      {
        id: 2,
        sender: { username: 'current_user', avatar: '/default-avatar.png' },
        content: "This is absolutely fire! The bass drop is insane 🎵",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        read: true
      },
      {
        id: 3,
        sender: { username: 'vibe_master', avatar: '/default-avatar.png' },
        content: "Right?! Spent all night perfecting it. Want to collab on something? 🚀",
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        read: false
      }
    ],
    2: [
      {
        id: 4,
        sender: { username: 'cosmic_dreamer', avatar: '/default-avatar.png' },
        content: "The stars are calling... ✨🌌",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      }
    ],
    3: [
      {
        id: 5,
        sender: { username: 'chaos_queen', avatar: '/default-avatar.png' },
        content: "CHAOS MODE ACTIVATED! 🌈⚡",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      }
    ]
  }

  useEffect(() => {
    setContacts(sampleContacts)
  }, [])

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setMessages(sampleMessages[contact.id] || [])
    setShowChat(true)
    
    // Mark messages as read
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ))
  }

  const handleSendMessage = (messageData) => {
    const newMessage = {
      ...messageData,
      id: Date.now()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleBack = () => {
    setShowChat(false)
    setSelectedContact(null)
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
          {/* Contact List - Hidden on mobile when chat is open */}
          <div className={`w-full lg:w-1/3 ${showChat ? 'hidden lg:block' : 'block'}`}>
            <ContactList
              contacts={contacts}
              selectedContact={selectedContact}
              onSelectContact={handleSelectContact}
              onNewChat={() => console.log('New chat')}
            />
          </div>

          {/* Chat Box - Hidden on mobile when no chat selected */}
          <div className={`w-full lg:w-2/3 ${!showChat ? 'hidden lg:block' : 'block'}`}>
            <ChatBox
              contact={selectedContact}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Messages
