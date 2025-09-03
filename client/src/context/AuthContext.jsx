import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user')
  }, [user])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => { setToken(null); setUser(null) }

  const updateProfile = async (payload) => {
    const { data } = await api.patch('/auth/me', payload)
    setUser(data.user)
    return data.user
  }

  const value = useMemo(() => ({ token, user, login, register, logout, updateProfile }), [token, user])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
