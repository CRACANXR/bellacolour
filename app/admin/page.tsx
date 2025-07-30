import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminRoute } from "@/components/admin/admin-route"

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  )
}
