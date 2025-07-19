"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Admin Girişi Gerekli</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">Bu sayfaya erişmek için admin hesabıyla giriş yapmanız gerekiyor.</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900">Demo Admin Hesapları:</p>
                      <p className="text-sm text-blue-700">admin@bellacolor.com</p>
                      <p className="text-sm text-blue-700">test@admin.com</p>
                      <p className="text-xs text-blue-600 mt-1">Şifre: herhangi bir şey</p>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setShowAuthModal(true)} className="w-full">
                  Giriş Yap
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-2xl">Erişim Reddedildi</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Bu sayfaya erişim yetkiniz bulunmuyor. Sadece sistem yöneticileri bu sayfayı görüntüleyebilir.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-900">Mevcut Hesap:</p>
                  <p className="text-sm text-yellow-700">Email: {user?.email}</p>
                  <p className="text-sm text-yellow-700">Rol: {user?.role}</p>
                  <p className="text-xs text-yellow-600 mt-1">Admin erişimi için admin hesabıyla giriş yapın</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Demo Admin Hesapları:</p>
                  <p className="text-sm text-blue-700">admin@bellacolor.com</p>
                  <p className="text-sm text-blue-700">test@admin.com</p>
                  <p className="text-xs text-blue-600 mt-1">Şifre: herhangi bir şey</p>
                </div>
              </div>
            </div>
            <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
