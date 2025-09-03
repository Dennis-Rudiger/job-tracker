import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const { data } = await api.get('/jobs/stats')
        setStats(data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load stats')
      }
    }
    load()
  }, [user])

  if (!user) {
  return (
      <div className="space-y-6">
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded p-6">
          <h1 className="text-3xl font-semibold mb-2">Welcome</h1>
          <p className="text-gray-600">Track your job hunt, stay organized, and keep momentum.</p>
          <div className="mt-4 flex gap-3 text-sm">
      <Link to="/login" className="px-3 py-2 bg-blue-600 text-white rounded">Login</Link>
      <Link to="/register" className="px-3 py-2 border rounded">Sign Up</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded p-6">
        <h1 className="text-3xl font-semibold mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-600">Track your job hunt, stay organized, and keep momentum.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <Link to="/jobs/new" className="px-3 py-2 bg-blue-600 text-white rounded">Add Job</Link>
          <Link to="/jobs" className="px-3 py-2 border rounded">View Jobs</Link>
        </div>
      </section>

      {error && <div className="text-red-600">{error}</div>}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard title="Total" value={stats?.total ?? '—'} />
        <StatCard title="Applied" value={stats?.byStatus?.applied ?? '—'} />
        <StatCard title="Interview" value={stats?.byStatus?.interview ?? '—'} />
        <StatCard title="Offers" value={stats?.byStatus?.offer ?? '—'} />
        <StatCard title="Rejected" value={stats?.byStatus?.rejected ?? '—'} />
      </section>

      <section>
        <div className="text-sm text-gray-600">Applied in last 30 days: <span className="font-medium text-gray-800">{stats?.last30Applied ?? '—'}</span></div>
      </section>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
