import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../config/firebase'

const AuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sync Firebase user → our MongoDB backend
  const syncWithBackend = async (firebaseUser) => {
    try {
      // Only get token if we don't have a recent one cached
      let idToken = localStorage.getItem('hushh_firebase_token')
      const tokenTime = localStorage.getItem('hushh_firebase_token_time')
      const isTokenFresh = tokenTime && Date.now() - parseInt(tokenTime) < 55 * 60 * 1000 // 55 min
      
      if (!idToken || !isTokenFresh) {
        idToken = await firebaseUser.getIdToken()
        localStorage.setItem('hushh_firebase_token', idToken)
        localStorage.setItem('hushh_firebase_token_time', Date.now().toString())
      }

      // Call backend to register/login with Firebase token
      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || 'firebase'
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Store the custom JWT from our backend too (for socket auth etc)
        if (data.token) {
          localStorage.setItem('hushh_token', data.token)
        }
        localStorage.setItem('hushh_user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        return { success: true, user: data.user }
      } else {
        const err = await response.json()
        throw new Error(err.message || 'Backend sync failed')
      }
    } catch (error) {
      console.error('Backend sync error:', error)
      return { success: false, message: error.message }
    }
  }

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Refresh token and sync with backend
          const result = await syncWithBackend(firebaseUser)
          if (!result.success) {
            // Fall back to checking stored token
            const token = localStorage.getItem('hushh_token')
            const cachedUser = localStorage.getItem('hushh_user')
            
            // Try using cached user data first (faster)
            if (cachedUser) {
              try {
                const userData = JSON.parse(cachedUser)
                setUser(userData)
                setIsAuthenticated(true)
              } catch (e) {
                // If cache is corrupted, verify with server
                if (token && token !== 'demo-token-123') {
                  const resp = await fetch(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (resp.ok) {
                    const data = await resp.json()
                    setUser(data.user)
                    setIsAuthenticated(true)
                  }
                }
              }
            }
          }
        } else {
          // No Firebase user — check for existing JWT session
          const token = localStorage.getItem('hushh_token')
          const cachedUser = localStorage.getItem('hushh_user')
          
          if (token && token !== 'demo-token-123') {
            // Use cached user if available (much faster)
            if (cachedUser) {
              try {
                const userData = JSON.parse(cachedUser)
                setUser(userData)
                setIsAuthenticated(true)
              } catch (e) {
                // Cache corrupted, re-verify from server
                try {
                  const resp = await fetch(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (resp.ok) {
                    const data = await resp.json()
                    setUser(data.user)
                    localStorage.setItem('hushh_user', JSON.stringify(data.user))
                    setIsAuthenticated(true)
                  } else {
                    localStorage.removeItem('hushh_token')
                    localStorage.removeItem('hushh_user')
                  }
                } catch (e) {
                  console.error('Auth check error:', e)
                }
              }
            } else {
              // No cache, fetch from server
              try {
                const resp = await fetch(`${API_URL}/auth/me`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                })
                if (resp.ok) {
                  const data = await resp.json()
                  setUser(data.user)
                  localStorage.setItem('hushh_user', JSON.stringify(data.user))
                  setIsAuthenticated(true)
                } else {
                  localStorage.removeItem('hushh_token')
                  localStorage.removeItem('hushh_user')
                }
              } catch (e) {
                console.error('Auth check error:', e)
              }
            }
          }
        }
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // ─── Firebase Google Sign-In ────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const syncResult = await syncWithBackend(result.user)
      if (syncResult.success) {
        toast.success(`🔥 Welcome, ${result.user.displayName || result.user.email}!`)
        return { success: true }
      } else {
        toast.error(syncResult.message || 'Google sign-in failed')
        return { success: false }
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error(getFirebaseErrorMessage(error.code))
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ─── Firebase GitHub Sign-In ────────────────────────────────────────────────
  const loginWithGithub = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, githubProvider)
      const syncResult = await syncWithBackend(result.user)
      if (syncResult.success) {
        toast.success(`🔥 Welcome, ${result.user.displayName || result.user.email}!`)
        return { success: true }
      } else {
        toast.error(syncResult.message || 'GitHub sign-in failed')
        return { success: false }
      }
    } catch (error) {
      console.error('GitHub sign-in error:', error)
      toast.error(getFirebaseErrorMessage(error.code))
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ─── Email/Password Login (Firebase) ────────────────────────────────────────
  const login = async (email, password) => {
    try {
      setLoading(true)

      // First try Firebase email/password auth
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const syncResult = await syncWithBackend(result.user)
        if (syncResult.success) {
          toast.success(syncResult.user?.profile?.displayName
            ? `🔥 Welcome back, ${syncResult.user.profile.displayName}!`
            : '🔥 Welcome back!')
          return { success: true }
        }
      } catch (firebaseError) {
        // Firebase failed — fall back to our custom JWT backend
        console.log('Firebase login failed, trying JWT backend:', firebaseError.code)
      }

      // Fallback: custom backend login
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('hushh_token', data.token)
        localStorage.setItem('hushh_user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        toast.success(data.message || `Welcome back, ${data.user.username}! 🔥`)
        return { success: true }
      } else {
        toast.error(data.message || 'Login failed')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed: ' + (error.message || 'Unknown error'))
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ─── Email/Password Register (Firebase) ─────────────────────────────────────
  const register = async (username, email, password, displayName) => {
    try {
      setLoading(true)

      // Create user in Firebase first
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        // The onAuthStateChanged listener will call syncWithBackend
        // But we need to pass username, so let's call backend directly
        const idToken = await result.user.getIdToken()
        const response = await fetch(`${API_URL}/auth/firebase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: displayName || username,
            username,
            photoURL: result.user.photoURL,
            provider: 'password'
          })
        })

        const data = await response.json()
        if (response.ok && data.success) {
          if (data.token) localStorage.setItem('hushh_token', data.token)
          localStorage.setItem('hushh_firebase_token', idToken)
          localStorage.setItem('hushh_user', JSON.stringify(data.user))
          setUser(data.user)
          setIsAuthenticated(true)
          toast.success(`🎉 Welcome to Hushh, ${data.user.username}!`)
          return { success: true }
        } else {
          // Rollback Firebase user if backend fails
          await result.user.delete()
          toast.error(data.message || 'Registration failed')
          return { success: false, message: data.message }
        }
      } catch (firebaseError) {
        // Firebase failed — fall back to custom backend
        console.log('Firebase register failed, trying custom backend:', firebaseError.code)
        if (firebaseError.code?.startsWith('auth/')) {
          toast.error(getFirebaseErrorMessage(firebaseError.code))
          return { success: false, message: firebaseError.message }
        }
      }

      // Fallback: custom backend registration
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, displayName })
      })
      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('hushh_token', data.token)
        localStorage.setItem('hushh_user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        toast.success(data.message || `Welcome to Hushh, ${data.user.username}! 🎉`)
        return { success: true }
      } else {
        toast.error(data.message || 'Registration failed')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed')
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Firebase signout error:', e)
    }
    localStorage.removeItem('hushh_token')
    localStorage.removeItem('hushh_firebase_token')
    localStorage.removeItem('hushh_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully! 👋')
  }

  // Helper to get human-readable Firebase error messages
  const getFirebaseErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Try again later',
      'auth/popup-closed-by-user': 'Sign-in cancelled',
      'auth/account-exists-with-different-credential': 'Account exists with different sign-in method',
      'auth/network-request-failed': 'Network error. Check your connection'
    }
    return messages[code] || 'Authentication failed'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      loginWithGoogle,
      loginWithGithub
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
