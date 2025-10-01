import { useState, useEffect } from 'react'

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('')
  const [effectiveType, setEffectiveType] = useState('')

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const conn = navigator.connection
        setConnectionType(conn.type || '')
        setEffectiveType(conn.effectiveType || '')
      }
    }

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Network information
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo)
      updateNetworkInfo()
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [])

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g'
  }
}

export default useOnlineStatus
