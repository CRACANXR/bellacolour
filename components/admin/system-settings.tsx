"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Save, RefreshCw, Database, Mail, Shield } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: "Bella Color",
    siteDescription: "Lüks Düğün Kırtasiyesi",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    maxProjectsPerUser: 10,
    sessionTimeout: 30,
    backupFrequency: "daily",
    smtpServer: "smtp.bellacolor.com",
    smtpPort: "587",
    smtpUsername: "noreply@bellacolor.com",
    adminEmail: "admin@bellacolor.com",
  })

  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Ayarlar Kaydedildi",
      description: "Sistem ayarları başarıyla güncellendi.",
    })
  }

  const handleBackup = () => {
    toast({
      title: "Yedekleme Başlatıldı",
      description: "Sistem yedeği oluşturuluyor...",
    })
  }

  const handleClearCache = () => {
    toast({
      title: "Önbellek Temizlendi",
      description: "Sistem önbelleği başarıyla temizlendi.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Genel Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Adı</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Admin E-posta</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Açıklaması</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Bakım Modu</Label>
              <p className="text-sm text-muted-foreground">Site bakım modunda olduğunda sadece adminler erişebilir</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="userRegistration">Kullanıcı Kaydı</Label>
              <p className="text-sm text-muted-foreground">Yeni kullanıcıların kayıt olmasına izin ver</p>
            </div>
            <Switch
              id="userRegistration"
              checked={settings.userRegistration}
              onCheckedChange={(checked) => setSettings({ ...settings, userRegistration: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            E-posta Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">E-posta Bildirimleri</Label>
              <p className="text-sm text-muted-foreground">Sistem e-posta bildirimlerini etkinleştir</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpServer">SMTP Sunucu</Label>
              <Input
                id="smtpServer"
                value={settings.smtpServer}
                onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="smtpUsername">SMTP Kullanıcı Adı</Label>
            <Input
              id="smtpUsername"
              value={settings.smtpUsername}
              onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Sistem Bakımı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleBackup} variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Yedek Al
            </Button>
            <Button onClick={handleClearCache} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Önbellek Temizle
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sistem Yenile
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxProjects">Kullanıcı Başına Max Proje</Label>
              <Input
                id="maxProjects"
                type="number"
                value={settings.maxProjectsPerUser}
                onChange={(e) => setSettings({ ...settings, maxProjectsPerUser: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700">
          <Save className="mr-2 h-4 w-4" />
          Ayarları Kaydet
        </Button>
      </div>
    </div>
  )
}
