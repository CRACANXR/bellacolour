"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/") // Redirect to homepage or a forbidden page
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600 mr-2" />
        <p className="text-lg text-gray-600">Yetkilendirme kontrol ediliyor...</p>
      </div>
    )
  }

  return <>{children}</>
}
