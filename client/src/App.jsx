import React, { useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobForm from './pages/JobForm'
import Profile from './pages/Profile'

const Protected = ({ children }) => {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="rounded px-2 py-1 border text-sm dark:border-gray-700">
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const { token } = useAuth()
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-semibold" onClick={close}>Job Tracker</Link>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="hover:underline" onClick={close}>Home</Link>
              {token ? (
                <>
                  <Link to="/jobs" className="hover:underline" onClick={close}>Jobs</Link>
                  <Link to="/jobs/new" className="hover:underline" onClick={close}>Add</Link>
                  <Link to="/profile" className="hover:underline" onClick={close}>Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:underline" onClick={close}>Login</Link>
                  <Link to="/register" className="hover:underline" onClick={close}>Register</Link>
                </>
              )}
            </nav>
            <ThemeToggle />
            <button className="md:hidden border rounded px-2 py-1" onClick={() => setOpen(o => !o)} aria-label="Toggle Menu">☰</button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden container mx-auto px-4 pb-3 space-y-2">
            <Link to="/" className="block" onClick={close}>Home</Link>
            {token ? (
              <>
                <Link to="/jobs" className="block" onClick={close}>Jobs</Link>
                <Link to="/jobs/new" className="block" onClick={close}>Add</Link>
                <Link to="/profile" className="block" onClick={close}>Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="block" onClick={close}>Login</Link>
                <Link to="/register" className="block" onClick={close}>Register</Link>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="container mx-auto px-4 py-6 flex-1">{children}</main>
      <footer className="border-t bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between">
          <div>© {new Date().getFullYear()} Job Tracker</div>
          <div>
            Contact: <a className="text-blue-600" href="mailto:rudigabuilds@gmail.com">rudigabuilds@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/jobs" element={<Protected><Layout><Jobs /></Layout></Protected>} />
          <Route path="/jobs/new" element={<Protected><Layout><JobForm mode="create" /></Layout></Protected>} />
          <Route path="/jobs/:id" element={<Protected><Layout><JobForm mode="edit" /></Layout></Protected>} />
          <Route path="/profile" element={<Protected><Layout><Profile /></Layout></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
