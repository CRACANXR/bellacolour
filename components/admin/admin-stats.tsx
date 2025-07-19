"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Heart, Activity, UserPlus } from "lucide-react"
import { getAdminStats } from "@/lib/auth"

export function AdminStats() {
  const stats = getAdminStats()

  const statCards = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Toplam Proje",
      value: stats.totalProjects.toLocaleString(),
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Save the Date",
      value: stats.totalSaveTheDates.toLocaleString(),
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      title: "Aktif Kullanıcı",
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Yeni Kayıt (7 gün)",
      value: stats.recentSignups.toLocaleString(),
      icon: UserPlus,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
