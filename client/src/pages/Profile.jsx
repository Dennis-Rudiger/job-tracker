import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMessage(''); setError('')
    try {
      const payload = { name: form.name, email: form.email }
      if (form.password) payload.password = form.password
      await updateProfile(payload)
      setMessage('Profile updated')
      setForm(f => ({ ...f, password: '' }))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update profile')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <button onClick={logout} className="text-red-600">Logout</button>
      </div>
      {message && <div className="text-green-700 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="name" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" type="email" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="New Password (optional)" value={form.password} onChange={onChange} />
        <button className="bg-blue-600 text-white py-2 rounded disabled:opacity-60" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  )
}
