"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "./admin-stats"
import { UserManagement } from "./user-management"
import { ProjectManagement } from "./project-management"
import { SystemSettings } from "./system-settings"
import { useAuth } from "@/contexts/auth-context"
import { BarChart3, Users, FileText, Settings, ArrowLeft, Shield, Activity, Database } from "lucide-react"

interface AdminDashboardProps {
  onBack: () => void
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-rose-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
                <p className="text-sm text-gray-600">Hoş geldin, {user?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Sistem Yöneticisi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Genel Bakış</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Kullanıcılar</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Projeler</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Ayarlar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Genel Bakış</h2>
              <p className="text-gray-600">Sistem istatistikleri ve genel durum</p>
            </div>
            <AdminStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Yeni kullanıcı kaydı</p>
                        <p className="text-sm text-gray-500">Ayşe Yılmaz - 2 saat önce</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Proje tamamlandı</p>
                        <p className="text-sm text-gray-500">Mehmet Kaya - 4 saat önce</p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Save the Date oluşturuldu</p>
                        <p className="text-sm text-gray-500">Zeynep Demir - 6 saat önce</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Sistem Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Sunucu Durumu</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Çevrimiçi</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Veritabanı</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Bağlı</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>E-posta Servisi</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Aktif</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Son Yedekleme</span>
                      <span className="text-sm text-gray-600">2 saat önce</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h2>
                <p className="text-gray-600">Tüm kullanıcıları görüntüle ve yönet</p>
              </div>
              <UserManagement />
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Proje Yönetimi</h2>
                <p className="text-gray-600">Kullanıcı projelerini görüntüle ve yönet</p>
              </div>
              <ProjectManagement />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistem Ayarları</h2>
                <p className="text-gray-600">Sistem konfigürasyonu ve bakım işlemleri</p>
              </div>
              <SystemSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
