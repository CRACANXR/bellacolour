"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser, saveUser, removeUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails - in a real app, this would be in a database
const ADMIN_EMAILS = ["admin@bellacolor.com", "admin@example.com", "test@admin.com"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      // Simple validation
      if (!email || !password) return false

      // Check if user is admin
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase())

      // In a real app, this would validate against a backend
      const newUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        email: email.toLowerCase(),
        name: name || (isAdmin ? "Admin User" : email.split("@")[0]),
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      saveUser(newUser)
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    removeUser()
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    saveUser(updatedUser)
    setUser(updatedUser)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
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
