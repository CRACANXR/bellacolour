"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { apiLogin, apiRegister, apiLogout, getCurrentUser } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast"

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiLogin(email, password)

      if (!response || !response.user) {
        toast({ title: "Login failed", description: "Invalid credentials.", variant: "destructive" })
        setUser(null)
        if (typeof window !== "undefined") localStorage.removeItem("user")
        return false
      }

      const userData: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      }

      setUser(userData)
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      setUser(null)
      if (typeof window !== "undefined") localStorage.removeItem("user")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const result = await apiRegister(email, password, name)
      if (result.success && result.user) {
        setUser(result.user)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await apiLogout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
