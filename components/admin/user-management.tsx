"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive"
  createdAt: string
}

const initialUsers: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "user", status: "active", createdAt: "2023-01-15" },
  { id: "2", name: "Bob Johnson", email: "bob@example.com", role: "admin", status: "active", createdAt: "2022-11-01" },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2023-03-20",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "user",
    status: "active",
    createdAt: "2023-05-10",
  },
  { id: "5", name: "Eve Adams", email: "eve@example.com", role: "admin", status: "inactive", createdAt: "2023-02-28" },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Omit<User, "id" | "createdAt">>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  })
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    const id = (users.length + 1).toString()
    const createdAt = new Date().toISOString().split("T")[0]
    setUsers([...users, { ...newUser, id, createdAt }])
    setNewUser({ name: "", email: "", role: "user", status: "active" })
    setIsAddUserModalOpen(false)
    toast({ title: "Kullanıcı Eklendi", description: `${newUser.name} başarıyla eklendi.` })
  }

  const handleEditUser = () => {
    if (currentUser) {
      setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)))
      setIsEditUserModalOpen(false)
      toast({ title: "Kullanıcı Güncellendi", description: `${currentUser.name} başarıyla güncellendi.` })
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    toast({ title: "Kullanıcı Silindi", description: "Kullanıcı başarıyla silindi." })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Kullanıcı Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rol
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Rol Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Kullanıcı</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Durum
                </Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value: "active" | "inactive") => setNewUser({ ...newUser, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Durum Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddUser}>Kullanıcı Ekle</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role === "admin" ? "Admin" : "Kullanıcı"}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menüyü Aç</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentUser(user)
                          setIsEditUserModalOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Ad Soyad
                </Label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rol
                </Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: "user" | "admin") => setCurrentUser({ ...currentUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Rol Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Kullanıcı</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Durum
                </Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value: "active" | "inactive") => setCurrentUser({ ...currentUser, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Durum Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <Button onClick={handleEditUser}>Değişiklikleri Kaydet</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
