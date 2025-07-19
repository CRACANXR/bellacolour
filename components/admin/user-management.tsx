"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, UserCheck, UserX, Shield, User } from "lucide-react"
import { getAllUsers, type AdminUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(getAllUsers())
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    toast({
      title: "Kullanıcı Durumu Güncellendi",
      description: `Kullanıcı durumu ${newStatus === "active" ? "aktif" : "pasif"} olarak değiştirildi.`,
    })
  }

  const handleRoleChange = (userId: string, newRole: "user" | "admin") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    toast({
      title: "Kullanıcı Rolü Güncellendi",
      description: `Kullanıcı rolü ${newRole === "admin" ? "admin" : "kullanıcı"} olarak değiştirildi.`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kullanıcı Yönetimi</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Proje Sayısı</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>Son Giriş</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Kullanıcı
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "default" : "destructive"}>
                    {user.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell>{user.projectCount}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "Hiç giriş yapmadı"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Pasif Yap
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Aktif Yap
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")}
                      >
                        {user.role === "admin" ? (
                          <>
                            <User className="mr-2 h-4 w-4" />
                            Kullanıcı Yap
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Yap
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
