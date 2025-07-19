"use client"

import { AdminRoute } from "@/components/admin/admin-route"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  return (
    <AdminRoute>
      <AdminDashboard onBack={() => router.push("/")} />
    </AdminRoute>
  )
}
