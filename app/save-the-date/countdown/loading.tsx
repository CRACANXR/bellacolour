import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <Loader2 className="h-8 w-8 animate-spin text-rose-600 mb-4" />
      <p className="text-lg text-gray-600">Yükleniyor...</p>
    </div>
  )
}
