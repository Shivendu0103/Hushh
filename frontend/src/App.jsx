import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'  // Add this import
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Header from './components/common/Header'
import PostFeed from './components/posts/PostFeed'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import FloatingButton from './components/ui/FloatingButton'
import LiquidBackground from './components/ui/LiquidBackground'
import Ballpit from './components/ui/Ballpit'

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
        <SocketProvider>  {/* Wrap with SocketProvider */}
          <Router>
            <div className="min-h-screen relative bg-transparent">
              <div className="fixed inset-0 z-0 w-full h-screen overflow-hidden pointer-events-none">
                <Ballpit
                  count={150}
                  gravity={0.01}
                  friction={0.9975}
                  wallBounce={0.95}
                  followCursor={true}
                  colors={[0x000000, 0xffffff, 0x8338ec, 0x111111, 0x4b0082]}
                  ambientIntensity={2}
                  lightIntensity={300}
                />
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
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/profile" element={<Profile />} />
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
        </SocketProvider>  {/* Close SocketProvider */}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
