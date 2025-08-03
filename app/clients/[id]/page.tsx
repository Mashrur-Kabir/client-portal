"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  Upload,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

// Mock data for the client
const client = {
  id: 1,
  name: "Acme Corporation",
  email: "contact@acme.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 15, 2024",
  avatar: "/placeholder-user.jpg",
}

const projects = [
  {
    id: 1,
    name: "Brand Identity Design",
    description: "Complete brand identity package including logo, colors, and guidelines",
    progress: 85,
    status: "In Progress",
    dueDate: "2024-01-15",
    deliverables: [
      { name: "Logo Design", status: "Completed", file: "logo-final.ai" },
      { name: "Color Palette", status: "Completed", file: "colors.pdf" },
      { name: "Brand Guidelines", status: "In Progress", file: null },
      { name: "Business Cards", status: "Pending", file: null },
    ],
  },
  {
    id: 2,
    name: "Website Redesign",
    description: "Modern, responsive website redesign with improved UX",
    progress: 60,
    status: "In Progress",
    dueDate: "2024-02-01",
    deliverables: [
      { name: "Wireframes", status: "Completed", file: "wireframes.pdf" },
      { name: "UI Design", status: "In Progress", file: null },
      { name: "Development", status: "Pending", file: null },
    ],
  },
]

const files = [
  { name: "Project Brief.pdf", size: "2.4 MB", uploadDate: "2024-01-10", type: "pdf" },
  { name: "Logo Concepts.zip", size: "15.2 MB", uploadDate: "2024-01-12", type: "zip" },
  { name: "Brand Colors.pdf", size: "1.1 MB", uploadDate: "2024-01-14", type: "pdf" },
]

const comments = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder-user.jpg",
    content:
      "The logo concepts look great! I particularly like option 2. Can we see some variations with different colors?",
    timestamp: "2 hours ago",
    isClient: true,
  },
  {
    id: 2,
    author: "You",
    avatar: "/placeholder-user.jpg",
    content: "I'll prepare some color variations for option 2. Should have them ready by tomorrow.",
    timestamp: "1 hour ago",
    isClient: false,
  },
]

export default function ClientPortalPage() {
  const [newComment, setNewComment] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "In Progress":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Client Header */}
        <Card className="glass-effect animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xl">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-montserrat font-bold">{client.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {client.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {client.phone}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Client since {client.joinDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect animate-slide-in">
              <CardHeader>
                <CardTitle className="font-montserrat">Active Projects</CardTitle>
                <CardDescription>Current project status and deliverables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-background/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="text-sm text-muted-foreground">Due: {project.dueDate}</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Deliverables</h4>
                      {project.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-background/50">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(deliverable.status)}
                            <span className="text-sm">{deliverable.name}</span>
                          </div>
                          {deliverable.file && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              {deliverable.file}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="glass-effect animate-slide-in">
              <CardHeader>
                <CardTitle className="font-montserrat">Project Discussion</CardTitle>
                <CardDescription>Communicate about project progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex space-x-3 ${comment.isClient ? "" : "flex-row-reverse space-x-reverse"}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 ${comment.isClient ? "" : "text-right"}`}>
                        <div
                          className={`p-3 rounded-lg ${comment.isClient ? "bg-background/50" : "bg-gradient-to-r from-pink-500/20 to-purple-500/20"}`}
                        >
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {comment.author} • {comment.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-pink-500/50 resize-none"
                    rows={2}
                  />
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Files Sidebar */}
          <div className="space-y-6">
            <Card className="glass-effect animate-slide-in">
              <CardHeader>
                <CardTitle className="font-montserrat">Project Files</CardTitle>
                <CardDescription>Shared documents and assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
