import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('hushh_token')
      
      if (token && token !== 'demo-token-123') {
        try {
          // Verify token with backend
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setIsAuthenticated(true)
            console.log('✅ User authenticated:', data.user.username)
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('hushh_token')
            localStorage.removeItem('hushh_user')
          }
        } catch (error) {
          console.error('Auth check error:', error)
          localStorage.removeItem('hushh_token')
          localStorage.removeItem('hushh_user')
        }
      } else {
        // Remove dummy token
        localStorage.removeItem('hushh_token')
        localStorage.removeItem('hushh_user')
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      
      console.log('🔍 Calling login API:', `${import.meta.env.VITE_API_URL}/auth/login`)
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      )

      const data = await response.json()
      console.log('🔍 Login response:', data)

      if (response.ok && data.success) {
        // Store real JWT token
        localStorage.setItem('hushh_token', data.token)
        localStorage.setItem('hushh_user', JSON.stringify(data.user))
        
        setUser(data.user)
        setIsAuthenticated(true)
        
        toast.success(data.message || `Welcome back, ${data.user.username}! 🔥`)
        console.log('✅ Login successful, real token:', data.token.substring(0, 20) + '...')
        
        return { success: true }
      } else {
        toast.error(data.message || 'Login failed')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error during login')
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (username, email, password, displayName) => {
    try {
      setLoading(true)
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password, displayName })
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        // Store real JWT token
        localStorage.setItem('hushh_token', data.token)
        localStorage.setItem('hushh_user', JSON.stringify(data.user))
        
        setUser(data.user)
        setIsAuthenticated(true)
        
        toast.success(data.message || `Welcome to Hushh, ${data.user.username}! 🎉`)
        console.log('✅ Registration successful, real token:', data.token.substring(0, 20) + '...')
        
        return { success: true }
      } else {
        toast.error(data.message || 'Registration failed')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error during registration')
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('hushh_token')
    localStorage.removeItem('hushh_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully! 👋')
    console.log('✅ User logged out')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
