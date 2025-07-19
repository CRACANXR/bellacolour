"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2, Info } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı.",
        })
        onSuccess?.()
      } else {
        toast({
          title: "Hata",
          description: "Geçersiz email veya şifre.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = (adminEmail: string) => {
    setEmail(adminEmail)
    setPassword("admin123")
  }

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>Hesabınıza giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
          {onSwitchToRegister && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <button type="button" onClick={onSwitchToRegister} className="text-rose-600 hover:underline">
                  Kayıt ol
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Admin Credentials */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Info className="mr-2 h-4 w-4" />
            Demo Hesapları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p className="font-medium mb-2">Admin Hesapları:</p>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                onClick={() => handleAdminLogin("admin@bellacolor.com")}
              >
                admin@bellacolor.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                onClick={() => handleAdminLogin("test@admin.com")}
              >
                test@admin.com
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Herhangi bir şifre ile giriş yapabilirsiniz</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
