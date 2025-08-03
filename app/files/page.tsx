"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Search,
  Upload,
  Download,
  FileText,
  ImageIcon,
  Video,
  Archive,
  MoreHorizontal,
  Grid3X3,
  List,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProtectedRoute from "@/components/layout/protected-route"

const files = [
  {
    id: 1,
    name: "Brand Guidelines.pdf",
    type: "pdf",
    size: "2.4 MB",
    client: "Acme Corporation",
    uploadDate: "2024-01-10",
    category: "Documents",
    status: "Shared",
  },
  {
    id: 2,
    name: "Logo Concepts.zip",
    type: "zip",
    size: "15.2 MB",
    client: "Acme Corporation",
    uploadDate: "2024-01-12",
    category: "Design",
    status: "Private",
  },
  {
    id: 3,
    name: "Website Mockup.fig",
    type: "figma",
    size: "8.7 MB",
    client: "TechStart Inc",
    uploadDate: "2024-01-14",
    category: "Design",
    status: "Shared",
  },
  {
    id: 4,
    name: "Project Brief.docx",
    type: "doc",
    size: "1.1 MB",
    client: "InnovateLab",
    uploadDate: "2024-01-08",
    category: "Documents",
    status: "Shared",
  },
  {
    id: 5,
    name: "App Screenshots.zip",
    type: "zip",
    size: "25.6 MB",
    client: "InnovateLab",
    uploadDate: "2024-01-15",
    category: "Images",
    status: "Private",
  },
  {
    id: 6,
    name: "Marketing Video.mp4",
    type: "video",
    size: "45.3 MB",
    client: "GrowthCo",
    uploadDate: "2024-01-16",
    category: "Media",
    status: "Shared",
  },
]

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || file.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || file.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-red-400" />
      case "jpg":
      case "png":
      case "gif":
      case "figma":
        return <ImageIcon className="w-8 h-8 text-blue-400" />
      case "mp4":
      case "mov":
      case "avi":
        return <Video className="w-8 h-8 text-purple-400" />
      case "zip":
      case "rar":
        return <Archive className="w-8 h-8 text-yellow-400" />
      default:
        return <FileText className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shared":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Private":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
  <ProtectedRoute>
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-montserrat font-bold">Files</h1>
            <p className="text-muted-foreground mt-2">Manage and share files with your clients</p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="glass-effect animate-slide-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-pink-500/50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-background/50 border-border/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border/50 rounded-lg bg-background/50">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file, index) => (
              <Card
                key={file.id}
                className="glass-effect hover:scale-105 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    {getFileIcon(file.type)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card/90 backdrop-blur-xl border-border/50">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-medium text-sm mb-2 truncate" title={file.name}>
                    {file.name}
                  </h3>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Size</span>
                      <span>{file.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client</span>
                      <span className="truncate ml-2">{file.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded</span>
                      <span>{file.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs">
                      {file.category}
                    </Badge>
                    <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-effect animate-fade-in">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {filteredFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 hover:bg-background/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {file.client} • {file.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-xs">
                        {file.category}
                      </Badge>
                      <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                      <span className="text-sm text-muted-foreground">{file.uploadDate}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card/90 backdrop-blur-xl border-border/50">
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  </ProtectedRoute>
  )
}
