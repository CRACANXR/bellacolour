"use client"

import SaveTheDateNotificator from "@/components/save-the-date-notificator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Share2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getProjectById, trackEvent } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface SaveTheDateData {
  id: string
  partner1_name?: string
  partner2_name?: string
  wedding_date: string
  created_at: string
  expires_at: string
  view_count: number
}

// Example mock object
const mock: SaveTheDateData = {
  id: "1",
  partner1_name: "A",
  partner2_name: "B",
  wedding_date: "2025-08-10",
  created_at: "2025-07-01",
  expires_at: "2025-08-11",
  view_count: 0,
};

export default function SaveTheDatePersistentPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<SaveTheDateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProjectById(params.id as string)

        if (result.success && result.data && result.data.type === "save-the-date") {
          const d = result.data;
          setData({
            id: d.id,
            partner1_name: d.partner1_name,
            partner2_name: d.partner2_name,
            wedding_date: d.wedding_date ?? "",
            created_at: d.created_at ?? "",
            expires_at: d.expires_at ?? "",
            view_count: d.view_count ?? 0,
          });
          await trackEvent({
            event: "save_the_date_link_viewed",
            data: { projectId: params.id },
          })
        } else {
          setError(result.error || "Link not found or is not a save-the-date project.")
        }
      } catch (err) {
        console.error("Failed to load save the date data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleShareLink = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Bağlantı Kopyalandı!",
      description: "Geri sayım bağlantısı panoya kopyalandı.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600 mb-4" />
        <p className="text-lg text-gray-600">Yükleniyor...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bağlantı Bulunamadı</h1>
        <p className="text-lg text-gray-600 mb-8">Bu bağlantı geçersiz veya süresi dolmuş olabilir.</p>
        <Button onClick={() => router.push("/save-the-date/countdown")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Yeni Bağlantı Oluştur
        </Button>
      </div>
    )
  }

  const partner1 = data.partner1_name || "XXXX"
  const partner2 = data.partner2_name || "YYYY"

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-100 via-white to-purple-100 py-24 overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f5f9' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/save-the-date/countdown")}
              className="mr-4 text-gray-700 hover:text-rose-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Sayım Oluşturucuya Dön
            </Button>
            <Button
              variant="outline"
              onClick={handleShareLink}
              className="text-gray-700 hover:text-rose-600 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Bağlantıyı Paylaş
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
            <h1 className="text-5xl font-serif text-gray-900 mb-4 leading-tight">
              <span className="text-rose-600">{partner1}</span> & <span className="text-purple-600">{partner2}</span>
            </h1>
            <p className="text-3xl font-bold text-gray-800">EVLENİYOR</p>
            <p className="text-sm text-gray-500 mt-4">
              Bu sayfa {new Date(data.expires_at).toLocaleDateString("tr-TR")} tarihine kadar aktif kalacak
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Notificator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Düğün Geri Sayımınız</h2>
          <div className="flex justify-center">
            <SaveTheDateNotificator initialTargetDate={data.wedding_date} />
          </div>
        </div>
      </section>
    </div>
  )
}
