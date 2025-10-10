import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('hushh_token'),
  loading: false,
  isAuthenticated: !!localStorage.getItem('hushh_token'),
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      }
    
    case 'AUTH_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      }
    
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        profile: {
          displayName: 'Demo User',
          avatar: null
        }
      }
      
      const mockToken = 'demo-token-123'
      
      localStorage.setItem('hushh_token', mockToken)
      localStorage.setItem('hushh_user', JSON.stringify(mockUser))
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: mockUser, token: mockToken } 
      })
      
      toast.success('🔥 Welcome back to Hushh!')
      return { success: true }
      
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL' })
      toast.error('Login failed')
      return { success: false, message: 'Login failed' }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('hushh_token')
    localStorage.removeItem('hushh_user')
    dispatch({ type: 'LOGOUT' })
    toast.success('👋 See you later!')
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
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
