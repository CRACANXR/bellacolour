"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  const handleSuccess = () => {
    onClose()
    onSuccess?.()
  }

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "register" : "login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} onSwitchToRegister={handleSwitchMode} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={handleSwitchMode} />
        )}
      </DialogContent>
    </Dialog>
  )
}
