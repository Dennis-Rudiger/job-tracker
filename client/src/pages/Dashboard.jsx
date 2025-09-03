import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.name} ({user.email})</span>
            <button onClick={logout} className="text-red-600">Logout</button>
          </div>
        ) : null}
      </div>
      <p className="text-gray-600">Track your job applications and their statuses.</p>
    </div>
  )
}
