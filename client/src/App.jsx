import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-semibold">Job Tracker</Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          <Link to="/jobs/new" className="hover:underline">Add</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </nav>
      </div>
    </header>
    <main className="container mx-auto px-4 py-6 flex-1">{children}</main>
  </div>
)

export default function App() {
  return (
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
  )
}
