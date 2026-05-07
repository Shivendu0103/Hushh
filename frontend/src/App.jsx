import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Header from './components/common/Header'
import PostFeed from './components/posts/PostFeed'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import Explore from './pages/Explore'
import Settings from './pages/Settings'
import FloatingButton from './components/ui/FloatingButton'
import LiquidBackground from './components/ui/LiquidBackground'

function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <PostFeed />
      </div>
      <FloatingButton onChaosMode={() => console.log('Chaos!')} />
    </div>
  )
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
            <Router>
            <div className="min-h-screen relative bg-transparent">
              <div className="fixed inset-0 z-0 w-full h-screen overflow-hidden pointer-events-none">
                {/* Background removed as requested */}
              </div>
              <div className="relative z-10">
                <Routes>
                  <Route path="/login" element={<LandingPage />} />
                  <Route path="/register" element={<LandingPage />} />
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Header />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/messages/:userId" element={<Messages />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:userId" element={<PublicProfile />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'rgba(20, 20, 40, 0.9)',
                    color: '#fff',
                    border: '1px solid #8338ec',
                    backdropFilter: 'blur(15px)'
                  }
                }}
              />
            </div>
            </Router>
          </SocketProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
