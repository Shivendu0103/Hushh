import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI, setAuthToken, getStoredToken, getStoredUser } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  isAuthenticated: !!getStoredToken(),
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

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authAPI.register(userData)
      const { token, user, message } = response.data
      
      // Store token and user
      localStorage.setItem('hushh_token', token)
      localStorage.setItem('hushh_user', JSON.stringify(user))
      setAuthToken(token)
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token } 
      })
      
      toast.success(message || '🎉 Welcome to Hushh!')
      return { success: true }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAIL' })
      toast.error(message)
      return { success: false, message }
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authAPI.login(credentials)
      const { token, user, message } = response.data
      
      // Store token and user
      localStorage.setItem('hushh_token', token)
      localStorage.setItem('hushh_user', JSON.stringify(user))
      setAuthToken(token)
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token } 
      })
      
      toast.success(message || `🔥 Welcome back, ${user.username}!`)
      return { success: true }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_FAIL' })
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('hushh_token')
    localStorage.removeItem('hushh_user')
    setAuthToken(null)
    dispatch({ type: 'LOGOUT' })
    toast.success('👋 See you later!')
  }

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = getStoredToken()
      if (token) {
        try {
          setAuthToken(token)
          const response = await authAPI.getMe()
          const user = response.data.user
          
          localStorage.setItem('hushh_user', JSON.stringify(user))
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user, token } 
          })
        } catch (error) {
          dispatch({ type: 'AUTH_FAIL' })
          localStorage.removeItem('hushh_token')
          localStorage.removeItem('hushh_user')
        }
      }
    }

    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
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
