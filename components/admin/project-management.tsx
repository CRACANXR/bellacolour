"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Eye, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  title: string
  type: "invitation" | "save-the-date"
  templateId: string
  userId: string
  createdAt: string
  lastModified: string
}

const initialProjects: Project[] = [
  {
    id: "proj1",
    title: "Sarah & Michael Düğün Davetiyesi",
    type: "invitation",
    templateId: "classic-elegant",
    userId: "1",
    createdAt: "2023-06-01",
    lastModified: "2023-06-10",
  },
  {
    id: "proj2",
    title: "Emma & James Save the Date",
    type: "save-the-date",
    templateId: "custom-countdown",
    userId: "2",
    createdAt: "2023-07-05",
    lastModified: "2023-07-05",
  },
  {
    id: "proj3",
    title: "Çiçekli Romantizm Davetiyesi",
    type: "invitation",
    templateId: "floral-romance",
    userId: "1",
    createdAt: "2023-08-12",
    lastModified: "2023-08-15",
  },
  {
    id: "proj4",
    title: "Vintage Cazibe Davetiyesi",
    type: "invitation",
    templateId: "vintage-charm",
    userId: "4",
    createdAt: "2023-09-01",
    lastModified: "2023-09-03",
  },
]

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.userId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    toast({ title: "Proje Silindi", description: "Proje başarıyla silindi." })
  }

  const handleViewProject = (id: string) => {
    // In a real app, this would navigate to the editor or a project view page
    toast({ title: "Proje Görüntüle", description: `Proje ID: ${id} görüntüleniyor (simüle edildi).` })
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Proje ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Şablon ID</TableHead>
              <TableHead>Kullanıcı ID</TableHead>
              <TableHead>Oluşturulma Tarihi</TableHead>
              <TableHead>Son Düzenleme</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge variant={project.type === "invitation" ? "default" : "secondary"}>
                    {project.type === "invitation" ? "Davetiye" : "Save the Date"}
                  </Badge>
                </TableCell>
                <TableCell>{project.templateId}</TableCell>
                <TableCell>{project.userId}</TableCell>
                <TableCell>{project.createdAt}</TableCell>
                <TableCell>{project.lastModified}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menüyü Aç</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                        <Eye className="mr-2 h-4 w-4" /> Görüntüle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
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
    </div>
  )
}
