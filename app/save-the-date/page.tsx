"use client"

import type React from "react"

import SaveTheDateNotificator from "@/components/save-the-date-notificator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast" // Assuming useToast is available

export default function SaveTheDateCreatorPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [partner1Name, setPartner1Name] = useState<string>("")
  const [partner2Name, setPartner2Name] = useState<string>("")
  const [shareableLink, setShareableLink] = useState<string>("")
  const { toast } = useToast() // Initialize toast for notifications

  useEffect(() => {
    if (selectedDate) {
      // Construct the shareable link with the current origin and new name parameters
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const params = new URLSearchParams()
      params.append("date", selectedDate)
      if (partner1Name) params.append("partner1", partner1Name)
      if (partner2Name) params.append("partner2", partner2Name)
      setShareableLink(`${origin}/save-the-date/countdown?${params.toString()}`)
    } else {
      setShareableLink("")
    }
  }, [selectedDate, partner1Name, partner2Name])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handlePartner1NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartner1Name(e.target.value)
  }

  const handlePartner2NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartner2Name(e.target.value)
  }

  const copyLinkToClipboard = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link Kopyalandı!",
        description: "Paylaşılabilir bağlantı panoya kopyalandı.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Save the Date Link Oluşturucu</h1>
            <p className="text-xl text-gray-600">Düğün gününüze özel geri sayım sayfanızı oluşturun ve paylaşın.</p>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>Bilgileri Girin</CardTitle>
            <CardDescription>Geri sayım sayfanız için tarih ve isimleri girin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wedding-date-input" className="mb-2 block">
                Düğün Tarihi
              </Label>
              <Input
                id="wedding-date-input"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="partner1-name-input" className="mb-2 block">
                Partner 1 Adı
              </Label>
              <Input
                id="partner1-name-input"
                type="text"
                value={partner1Name}
                onChange={handlePartner1NameChange}
                placeholder="Örn: Ayşe"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="partner2-name-input" className="mb-2 block">
                Partner 2 Adı
              </Label>
              <Input
                id="partner2-name-input"
                type="text"
                value={partner2Name}
                onChange={handlePartner2NameChange}
                placeholder="Örn: Can"
                className="w-full"
              />
            </div>
            {selectedDate && (partner1Name || partner2Name) && (
              <div className="space-y-2">
                <Label>Paylaşılabilir Bağlantı</Label>
                <div className="flex items-center space-x-2">
                  <Input value={shareableLink} readOnly className="flex-grow" />
                  <Button onClick={copyLinkToClipboard} disabled={!shareableLink}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Bağlantıyı Kopyala</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Bu bağlantıyı sevdiklerinizle paylaşın!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedDate && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Geri Sayım Önizlemesi</h2>
            <SaveTheDateNotificator initialTargetDate={selectedDate} />
          </div>
        )}
      </div>
    </div>
  )
}
