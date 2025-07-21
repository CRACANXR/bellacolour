"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { loginUser, registerUser, logoutUser, trackEvent, type LoginResponse } from "@/lib/api-service"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt?: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount (for offline persistence)
    const savedUser = localStorage.getItem("wedding_app_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("wedding_app_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await loginUser(email, password)

      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        lastLogin: new Date().toISOString(),
      }

      setUser(userData)
      localStorage.setItem("wedding_app_user", JSON.stringify(userData))

      // Track login event
      await trackEvent({
        event: "user_login",
        userId: userData.id,
        data: { email: userData.email, role: userData.role },
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await registerUser({ email, password, name })

      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      setUser(userData)
      localStorage.setItem("wedding_app_user", JSON.stringify(userData))

      // Track registration event
      await trackEvent({
        event: "user_register",
        userId: userData.id,
        data: { email: userData.email, name: userData.name },
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      if (user) {
        // Track logout event
        await trackEvent({
          event: "user_logout",
          userId: user.id,
        })

        // Call backend logout
        await logoutUser()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("wedding_app_user")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("wedding_app_user", JSON.stringify(updatedUser))
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
        register,
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
