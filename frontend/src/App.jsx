import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'

// Placeholder components (we'll build these next!)
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="glass glass-hover p-8 text-center">
        <h1 className="text-6xl font-bold neon-text mb-4">Hushh ✨</h1>
        <p className="text-gray-300 text-xl">Welcome to the future of social media</p>
        <div className="mt-6 p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
          <p className="text-white font-semibold">🚀 Setup Complete! Ready to build features!</p>
        </div>
      </div>
    </div>
  )
}

function Login() {
  return <div className="p-8 text-center text-white">Login Page Coming Soon! 🔐</div>
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
