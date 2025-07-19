"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { useState, useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, fallback, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [requireAuth, isAuthenticated])

  if (requireAuth && !isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Gerekli</h1>
              <p className="text-gray-600 mb-8">Bu özelliği kullanmak için giriş yapmanız gerekiyor.</p>
            </div>
          </div>
        )}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return <>{children}</>
}
