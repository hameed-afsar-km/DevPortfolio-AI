import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('devportfolio_user')
    const token = localStorage.getItem('devportfolio_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    setUser(res.user)
    localStorage.setItem('devportfolio_user', JSON.stringify(res.user))
    localStorage.setItem('devportfolio_token', res.token)
    return res
  }

  const register = async (data) => {
    const res = await authService.register(data)
    setUser(res.user)
    localStorage.setItem('devportfolio_user', JSON.stringify(res.user))
    localStorage.setItem('devportfolio_token', res.token)
    return res
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('devportfolio_user')
    localStorage.removeItem('devportfolio_token')
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('devportfolio_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
