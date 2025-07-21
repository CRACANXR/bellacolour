"use client"

import SaveTheDateNotificator from "@/components/save-the-date-notificator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { createSaveTheDate, trackEvent } from "@/lib/api-service"

export default function SaveTheDateCreatorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [partner1Name, setPartner1Name] = useState<string>("")
  const [partner2Name, setPartner2Name] = useState<string>("")
  const [shareableLink, setShareableLink] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateLink = async () => {
    if (!selectedDate) {
      toast({
        title: "Hata",
        description: "Lütfen düğün tarihini seçin.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await createSaveTheDate({
        partner1Name: partner1Name || undefined,
        partner2Name: partner2Name || undefined,
        weddingDate: selectedDate,
        createdBy: user?.id,
      })

      setShareableLink(response.shareableUrl)

      // Track event
      await trackEvent({
        event: "save_the_date_created",
        userId: user?.id,
        data: {
          hasPartner1: !!partner1Name,
          hasPartner2: !!partner2Name,
          weddingDate: selectedDate,
        },
      })

      toast({
        title: "Başarılı!",
        description: "Save the Date bağlantınız oluşturuldu.",
      })
    } catch (error) {
      console.error("Error creating Save the Date:", error)
      toast({
        title: "Hata",
        description: "Bağlantı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyLinkToClipboard = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link Kopyalandı!",
        description: "Paylaşılabilir bağlantı panoya kopyalandı.",
      })

      // Track copy event
      trackEvent({
        event: "save_the_date_link_copied",
        userId: user?.id,
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Save the Date Link Oluşturucu</h1>
              <p className="text-xl text-gray-600">
                Merhaba {user?.name}! Düğün gününüze özel geri sayım sayfanızı oluşturun ve paylaşın.
              </p>
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
                  Düğün Tarihi *
                </Label>
                <Input
                  id="wedding-date-input"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                  required
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
                  onChange={(e) => setPartner1Name(e.target.value)}
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
                  onChange={(e) => setPartner2Name(e.target.value)}
                  placeholder="Örn: Can"
                  className="w-full"
                />
              </div>

              <Button onClick={handleCreateLink} disabled={!selectedDate || isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Bağlantı Oluştur"
                )}
              </Button>

              {shareableLink && (
                <div className="space-y-2">
                  <Label>Paylaşılabilir Bağlantı</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={shareableLink} readOnly className="flex-grow" />
                    <Button onClick={copyLinkToClipboard}>
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
    </ProtectedRoute>
  )
}
