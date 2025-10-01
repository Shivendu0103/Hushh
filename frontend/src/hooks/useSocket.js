import { useContext, useEffect, useCallback } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useAuth } from './useAuth'

const useSocket = () => {
  const context = useContext(SocketContext)
  const { isAuthenticated } = useAuth()
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  // Listen for specific events
  const useSocketListener = useCallback((event, callback, deps = []) => {
    useEffect(() => {
      if (context.socket && isAuthenticated) {
        context.socket.on(event, callback)
        
        return () => {
          context.socket.off(event, callback)
        }
      }
    }, [event, callback, isAuthenticated, ...deps])
  }, [context.socket, isAuthenticated])

  // Enhanced methods
  const emitWithAck = useCallback(async (event, data, timeout = 5000) => {
    if (!context.socket) return null
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Socket timeout'))
      }, timeout)
      
      context.socket.emit(event, data, (response) => {
        clearTimeout(timer)
        resolve(response)
      })
    })
  }, [context.socket])

  const joinRoom = useCallback((roomName) => {
    if (context.socket) {
      context.socket.emit('join_room', roomName)
    }
  }, [context.socket])

  const leaveRoom = useCallback((roomName) => {
    if (context.socket) {
      context.socket.emit('leave_room', roomName)
    }
  }, [context.socket])

  return {
    ...context,
    useSocketListener,
    emitWithAck,
    joinRoom,
    leaveRoom,
    isConnected: !!context.socket?.connected
  }
}

export default useSocket
