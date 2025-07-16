"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Homepage from "@/components/homepage"
import { InvitationEditor } from "@/components/invitation-editor"
import { Heart, Sparkles, Crown, Flower } from "lucide-react"
import dynamic from "next/dynamic"
// Removed: import SaveTheDateNotificator from "@/components/save-the-date-notificator"

const ARShowcase = dynamic(() => import("@/components/ar-showcase"), { ssr: false })

const templates = [
  {
    id: "classic-elegant",
    name: "Klasik Zarafet",
    category: "Geleneksel",
    preview: "/placeholder.svg?height=300&width=200",
    icon: Crown,
    elements: [
      { type: "text", content: "Sarah & Michael", x: 100, y: 80, fontSize: 32, fontFamily: "serif", color: "#8B4513" },
      {
        type: "text",
        content: "Sizleri aramızda görmekten mutluluk duyarız",
        x: 100,
        y: 120,
        fontSize: 14,
        fontFamily: "serif",
        color: "#666",
      },
      {
        type: "text",
        content: "Cumartesi, 15 Haziran 2024",
        x: 100,
        y: 180,
        fontSize: 16,
        fontFamily: "serif",
        color: "#333",
      },
      { type: "text", content: "16:00", x: 100, y: 200, fontSize: 16, fontFamily: "serif", color: "#333" },
      { type: "text", content: "Büyük Balo Salonu", x: 100, y: 240, fontSize: 14, fontFamily: "serif", color: "#666" },
    ],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Çağdaş",
    preview: "/placeholder.svg?height=300&width=200",
    icon: Sparkles,
    elements: [
      {
        type: "text",
        content: "EMMA & JAMES",
        x: 100,
        y: 100,
        fontSize: 28,
        fontFamily: "sans-serif",
        color: "#2C3E50",
      },
      {
        type: "text",
        content: "EVLENİYORLAR",
        x: 100,
        y: 130,
        fontSize: 12,
        fontFamily: "sans-serif",
        color: "#7F8C8D",
      },
      { type: "text", content: "20.08.2024", x: 100, y: 180, fontSize: 24, fontFamily: "sans-serif", color: "#E74C3C" },
      {
        type: "text",
        content: "TÖREN 15:00'TE",
        x: 100,
        y: 220,
        fontSize: 14,
        fontFamily: "sans-serif",
        color: "#2C3E50",
      },
    ],
  },
  {
    id: "floral-romance",
    name: "Çiçekli Romantizm",
    category: "Romantik",
    preview: "/placeholder.svg?height=300&width=200",
    icon: Flower,
    elements: [
      {
        type: "text",
        content: "Isabella & Alexander",
        x: 100,
        y: 90,
        fontSize: 30,
        fontFamily: "cursive",
        color: "#8E44AD",
      },
      {
        type: "text",
        content: "Aileleriyle birlikte",
        x: 100,
        y: 130,
        fontSize: 12,
        fontFamily: "serif",
        color: "#666",
      },
      {
        type: "text",
        content: "Birlikteliklerini kutlamak için sizleri davet ediyorlar",
        x: 100,
        y: 145,
        fontSize: 12,
        fontFamily: "serif",
        color: "#666",
      },
      {
        type: "text",
        content: "12 Eylül 2024",
        x: 100,
        y: 190,
        fontSize: 18,
        fontFamily: "serif",
        color: "#8E44AD",
      },
      {
        type: "text",
        content: "Bahçe Pavyonu • 17:30",
        x: 100,
        y: 220,
        fontSize: 14,
        fontFamily: "serif",
        color: "#666",
      },
    ],
  },
  {
    id: "vintage-charm",
    name: "Vintage Cazibe",
    category: "Vintage",
    preview: "/placeholder.svg?height=300&width=200",
    icon: Heart,
    elements: [
      {
        type: "text",
        content: "Charlotte & William",
        x: 100,
        y: 85,
        fontSize: 28,
        fontFamily: "serif",
        color: "#8B4513",
      },
      {
        type: "text",
        content: "~ Kuruluş: 2024 ~",
        x: 100,
        y: 115,
        fontSize: 14,
        fontFamily: "serif",
        color: "#D2691E",
      },
      {
        type: "text",
        content: "Sizleri aramızda görmek isteriz",
        x: 100,
        y: 160,
        fontSize: 14,
        fontFamily: "serif",
        color: "#666",
      },
      {
        type: "text",
        content: "5 Ekim 2024, Cumartesi",
        x: 100,
        y: 190,
        fontSize: 12,
        fontFamily: "serif",
        color: "#8B4513",
      },
      {
        type: "text",
        content: "Tarihi Köşk",
        x: 100,
        y: 230,
        fontSize: 14,
        fontFamily: "serif",
        color: "#666",
      },
    ],
  },
]

export default function App() {
  const [currentView, setCurrentView] = useState<"homepage" | "templates" | "editor">("homepage")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)

  const handleNavigateToTemplates = () => {
    setCurrentView("templates")
  }

  const handleTemplateSelect = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template)
    setCurrentView("editor")
  }

  const handleBackToHomepage = () => {
    setCurrentView("homepage")
    setSelectedTemplate(null)
  }

  const handleBackToTemplates = () => {
    setCurrentView("templates")
    setSelectedTemplate(null)
  }

  if (currentView === "editor" && selectedTemplate) {
    return <InvitationEditor template={selectedTemplate} onBack={handleBackToTemplates} />
  }

  if (currentView === "templates") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={handleBackToHomepage} className="mr-4">
              ← Ana Sayfa
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Düğün Davetiyesi Tasarımcısı</h1>
              <p className="text-xl text-gray-600">
                Profesyonel tasarım araçlarımızla güzel ve kişiselleştirilmiş düğün davetiyeleri oluşturun.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Şablonunuzu Seçin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => {
                const IconComponent = template.icon
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <IconComponent className="h-5 w-5 text-rose-500" />
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[3/4] bg-white border-2 border-gray-200 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={template.preview || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full group-hover:bg-rose-600 transition-colors"
                      >
                        Bu Tasarımı Özelleştir
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="mr-4 bg-transparent">
              Kendi Tasarımını Yükle
            </Button>
            <Button variant="outline" size="lg">
              Boş Sayfadan Başla
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Homepage onNavigateToEditor={handleNavigateToTemplates} />
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-4">AR Davetiye Deneyimini Keşfet</h2>
        <p className="text-center text-gray-600 mb-8">
          Davetiyenizi Three.js destekli Artırılmış Gerçeklik ile deneyimleyin!
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl h-[400px] bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
            <ARShowcase />
          </div>
        </div>
      </section>
    </div>
  )
}
