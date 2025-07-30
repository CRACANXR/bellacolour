"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminStats } from "./admin-stats"
import { UserManagement } from "./user-management"
import { ProjectManagement } from "./project-management"
import { SystemSettings } from "./system-settings"
import { BarChart, Users, Folder, Settings } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Paneli</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" /> Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" /> Kullanıcılar
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Folder className="mr-2 h-4 w-4" /> Projeler
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Ayarlar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AdminStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Son Satışlar</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {/* Placeholder for recent sales chart/list */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Satış verileri burada gösterilecek.
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popüler Şablonlar</CardTitle>
                <CardDescription>En çok kullanılan davetiye şablonları.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for popular templates list */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Şablon listesi burada gösterilecek.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <ProjectManagement />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
