"use client"

import SaveTheDateNotificator from "@/components/save-the-date-notificator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SaveTheDateCountdownPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [targetDate, setTargetDate] = useState<string | null>(null)
  const [partner1, setPartner1] = useState<string>("XXXX") // Default value
  const [partner2, setPartner2] = useState<string>("YYYY") // Default value

  useEffect(() => {
    const dateParam = searchParams.get("date")
    const partner1Param = searchParams.get("partner1")
    const partner2Param = searchParams.get("partner2")

    if (dateParam) {
      setTargetDate(dateParam)
    }
    if (partner1Param) {
      setPartner1(partner1Param)
    }
    if (partner2Param) {
      setPartner2(partner2Param)
    }
  }, [searchParams])

  if (!targetDate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Geçersiz Tarih</h1>
        <p className="text-lg text-gray-600 mb-8">Lütfen geçerli bir düğün tarihi içeren bir bağlantı kullanın.</p>
        <Button onClick={() => router.push("/save-the-date")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Sayım Oluştur
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-100 via-white to-purple-100 py-24 overflow-hidden text-center">
        {/* Decorative background pattern */}
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
              onClick={() => router.push("/save-the-date")}
              className="mr-4 text-gray-700 hover:text-rose-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Sayım Oluşturucuya Dön
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
            <h1 className="text-5xl font-serif text-gray-900 mb-4 leading-tight">
              <span className="text-rose-600">{partner1}</span> & <span className="text-purple-600">{partner2}</span>
            </h1>
            <p className="text-3xl font-bold text-gray-800">EVLENİYOR</p>
          </div>
        </div>
      </section>

      {/* Countdown Notificator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Düğün Geri Sayımınız</h2>
          <div className="flex justify-center">
            <SaveTheDateNotificator initialTargetDate={targetDate} />
          </div>
        </div>
      </section>
    </div>
  )
}
