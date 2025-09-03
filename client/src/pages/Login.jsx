import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await login(email, password)
      nav('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <div className="text-red-600 mb-2" role="alert">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" autoComplete="email" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <div className="flex items-stretch gap-2">
            <input id="password" autoComplete="current-password" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button type="button" onClick={()=>setShowPw(s=>!s)} className="px-3 rounded border border-gray-300 dark:border-gray-700 text-sm">{showPw ? 'Hide' : 'Show'}</button>
          </div>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  )
}
