import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Dünya evine beraber girelim",
  description: "CRACANXR",
  generator: "CRACANXR",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer-umd.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <model-viewer
          src="/ar-assets/kapaklı.glb"
          ios-src="/ar-assets/AR-Code-Object-Capture-app-1735541303 2.usdz"
          alt="kapaklı"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          style={{ width: '100%', height: '350px', background: 'white', borderRadius: '0.5rem' }}
          exposure="1"
        />
      </body>
    </html>
  )
}
