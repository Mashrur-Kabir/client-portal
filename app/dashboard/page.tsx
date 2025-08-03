"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Users, FolderOpen, FileText, TrendingUp, Clock, CheckCircle } from "lucide-react"
import ProtectedRoute from "@/components/layout/protected-route"

const stats = [
  {
    title: "Total Clients",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "Active Projects",
    value: "18",
    change: "+8%",
    icon: FolderOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Files Shared",
    value: "156",
    change: "+23%",
    icon: FileText,
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+15%",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
  },
]

const recentProjects = [
  { name: "Brand Identity Design", client: "Acme Corp", progress: 85, status: "In Progress", dueDate: "2024-01-15" },
  { name: "Website Redesign", client: "TechStart", progress: 60, status: "In Progress", dueDate: "2024-01-20" },
  { name: "Mobile App UI", client: "InnovateLab", progress: 100, status: "Completed", dueDate: "2024-01-10" },
  { name: "Marketing Materials", client: "GrowthCo", progress: 30, status: "In Progress", dueDate: "2024-01-25" },
]

const recentActivity = [
  { action: "New file uploaded", client: "Acme Corp", time: "2 hours ago", type: "upload" },
  { action: "Project completed", client: "InnovateLab", time: "5 hours ago", type: "complete" },
  { action: "Message received", client: "TechStart", time: "1 day ago", type: "message" },
  { action: "Payment received", client: "GrowthCo", time: "2 days ago", type: "payment" },
]

export default function DashboardPage() {
  return (
  <ProtectedRoute>
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-montserrat font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your clients.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="glass-effect hover:scale-105 transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-montserrat font-bold">{stat.value}</div>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card className="glass-effect animate-fade-in">
            <CardHeader>
              <CardTitle className="font-montserrat">Recent Projects</CardTitle>
              <CardDescription>Track your ongoing project progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project, index) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"} className="ml-2">
                        {project.status === "Completed" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-effect animate-fade-in">
            <CardHeader>
              <CardTitle className="font-montserrat">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-gradient-to-br ${activity.type === "complete" ? "from-green-500 to-emerald-500" : activity.type === "upload" ? "from-blue-500 to-cyan-500" : activity.type === "message" ? "from-yellow-500 to-orange-500" : "from-pink-500 to-purple-500"}`}
                  >
                    {activity.type === "complete" && <CheckCircle className="w-3 h-3 text-white" />}
                    {activity.type === "upload" && <FileText className="w-3 h-3 text-white" />}
                    {activity.type === "message" && <Users className="w-3 h-3 text-white" />}
                    {activity.type === "payment" && <TrendingUp className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.client}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  </ProtectedRoute>
  )
}
