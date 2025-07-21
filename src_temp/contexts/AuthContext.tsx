"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "../utils/api"

interface User {
  user_id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/users/profile")
        setUser(response.data)
      } catch (err) {
        // User is not logged in, which is fine
        console.log("User not authenticated")
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post("/users/login", { email, password })
      setUser(response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post("/users/register", { email, password, name })
      setUser(response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await api.post("/users/logout")
      setUser(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Logout failed")
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
