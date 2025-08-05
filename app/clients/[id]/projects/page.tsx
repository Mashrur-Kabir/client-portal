"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, MoreHorizontal, Download, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


type Project = {
  id: string
  title: string
  description: string
  status: string
  progress: number
  priority: string
  deadline: string
  assigned_to: string
  deliverables: number
  completed_deliverables: number
}

type Deliverable = {
  id: string
  name: string
  status: string
  file_url: string | null
  project_id: string
}

export default function ClientProjectsPage() {
  const { id: clientId } = useParams()
  const router = useRouter()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)

  const [deliverablesMap, setDeliverablesMap] = useState<Record<string, Deliverable[]>>({})
  
  const [editDeliverable, setEditDeliverable] = useState<any | null>(null)
  const [editDeliverableForm, setEditDeliverableForm] = useState({ title: "", notes: "" })

  const [createForProjectId, setCreateForProjectId] = useState<string | null>(null)
  const [newDeliverableForm, setNewDeliverableForm] = useState({
    title: "",
    notes: "",
  })


  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "in-progress",
  })

  const handleUpload = async (deliverableId: string, file: File) => {
  const filePath = `${deliverableId}/${file.name}`
  const { error: uploadError } = await supabase.storage
    .from("deliverables")
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error("File upload failed:", uploadError.message)
    return
  }

  const { data: publicUrlData } = supabase.storage
    .from("deliverables")
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from("deliverables")
    .update({ file_url: publicUrlData.publicUrl })
    .eq("id", deliverableId)

    if (updateError) {
        console.error("Updating file URL failed:", updateError.message)
    } else {
        router.refresh()
    }
  }

  const toggleDeliverableCompletion = async (id: string, current: boolean) => {
  const { error } = await supabase
    .from("deliverables")
    .update({ is_completed: !current })
    .eq("id", id)

    if (error) console.error("Error updating completion:", error.message)
    else router.refresh()
  }

  const handleEditDeliverable = async () => {
  if (!editDeliverable) return
  const { error } = await supabase
    .from("deliverables")
    .update(editDeliverableForm)
    .eq("id", editDeliverable.id)

  if (!error) {
    setEditDeliverable(null)
    setEditDeliverableForm({ title: "", notes: "" })
    router.refresh()
  } else {
    console.error("Error updating deliverable:", error.message)
  }
}

const handleCreateDeliverable = async () => {
  if (!createForProjectId) return

  const { error } = await supabase.from("deliverables").insert({
    name: newDeliverableForm.title,
    notes: newDeliverableForm.notes,
    project_id: createForProjectId,
    status: "Pending",
  })

  if (!error) {
    setCreateForProjectId(null)
    setNewDeliverableForm({ title: "", notes: "" })
    router.refresh()
  } else {
    console.error("Error creating deliverable:", error.message)
  }
}

  

  useEffect(() => {
    if (!clientId) return
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)

      if (!error && data) {
        setProjects(data)
      } else {
        console.error("Error fetching projects:", error)
      }

    const projectIds = data.map(p => p.id)
    const { data: deliverablesData, error: deliverablesError } = await supabase
    .from("deliverables")
    .select("*")
    .in("project_id", projectIds)

    if (!deliverablesError && deliverablesData) {
    const map: Record<string, Deliverable[]> = {}
    deliverablesData.forEach((d) => {
        if (!map[d.project_id]) map[d.project_id] = []
        map[d.project_id].push(d)
    })
    setDeliverablesMap(map)
    } else {
    console.error("Error fetching deliverables:", deliverablesError)
    }

      setLoading(false)
    }
    fetchProjects()
  }, [clientId, supabase])

  const getBadgeColor = (type: "status" | "priority", value: string) => {
    const colors = {
      status: {
        Completed: "bg-green-500/20 text-green-400 border-green-500/30",
        "In Progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        Planning: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        "On Hold": "bg-red-500/20 text-red-400 border-red-500/30",
      },
      priority: {
        High: "bg-red-500/20 text-red-400 border-red-500/30",
        Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        Low: "bg-green-500/20 text-green-400 border-green-500/30",
      },
    }
    if (type === "status") {
      return (
        colors.status[value as keyof typeof colors.status] ||
        "bg-gray-500/20 text-gray-400 border-gray-500/30"
      )
    } else {
      return (
        colors.priority[value as keyof typeof colors.priority] ||
        "bg-gray-500/20 text-gray-400 border-gray-500/30"
      )
    }
  }

  const handleCreate = async () => {
    const { error } = await supabase.from("projects").insert({
      client_id: clientId,
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      status: form.status,
    })

    if (!error) {
      setCreateOpen(false)
      setForm({ title: "", description: "", deadline: "", status: "in-progress" })
      router.refresh()
    } else {
      console.error("Error creating project:", error.message)
    }
  }

  const handleUpdate = async () => {
    if (!editProject) return
    const { error } = await supabase
      .from("projects")
      .update({
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        status: form.status,
      })
      .eq("id", editProject.id)

    if (!error) {
      setEditOpen(false)
      setEditProject(null)
      router.refresh()
    } else {
      console.error("Error updating project:", error.message)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (!error) router.refresh()
    else console.error("Error deleting project:", error.message)
  }

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


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-montserrat font-bold">Client Projects</h1>
          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-500"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground">No projects found for this client.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <Card
                key={project.id}
                className="glass-effect animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-montserrat text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card/90 backdrop-blur-xl border-border/50">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditProject(project)
                          setForm({
                            title: project.title,
                            description: project.description,
                            deadline: project.deadline,
                            status: project.status,
                          })
                          setEditOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getBadgeColor("status", project.status)}>{project.status}</Badge>
                    <Badge className={getBadgeColor("priority", project.priority)}>{project.priority}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Assigned to: <span className="font-medium">{project.assigned_to}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Deliverables:{" "}
                    <span className="font-medium">
                      {project.completed_deliverables}/{project.deliverables}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Deadline: <span className="font-medium">{project.deadline}</span>
                  </div>

                  {deliverablesMap[project.id] && (
                    <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium">Deliverables</h4>
                        {deliverablesMap[project.id].map((d) => (
                        <div
                            key={d.id}
                            className="flex items-center justify-between p-2 rounded bg-background/50"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={d.status === "Completed"}
                                    onChange={() => toggleDeliverableCompletion(d.id, d.status === "Completed")}
                                    className="form-checkbox accent-pink-500"
                                />
                                <span
                                    className={`text-sm ${
                                    d.status === "Completed" ? "line-through text-muted-foreground" : ""
                                    }`}
                                >
                                    {d.name}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                    setEditDeliverable(d)
                                    setEditDeliverableForm({ title: d.name, notes: d.notes ?? "" })
                                    }}
                                    className="ml-auto"
                                >
                                    ✏️
                                </Button>
                            </div>
                            {d.file_url ? (
                            <a
                                href={d.file_url}
                                download
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                <Download className="w-4 h-4 inline mr-1" />
                                File
                            </a>
                            ) : (
                            <Input
                                type="file"
                                onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleUpload(d.id, e.target.files[0])
                                }
                                }}
                                className="text-sm max-w-[150px] cursor-pointer"
                            />
                            )}
                        </div>
                        ))}
                    </div>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                        onClick={() => setCreateForProjectId(project.id)}
                        >
                        + Add Deliverable
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Label>Deadline</Label>
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Label>Deadline</Label>
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* edit deliverable */}
      <Dialog open={!!editDeliverable} onOpenChange={(val) => !val && setEditDeliverable(null)}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit Deliverable</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <Label>Title</Label>
            <Input
                value={editDeliverableForm.title}
                onChange={(e) =>
                setEditDeliverableForm({ ...editDeliverableForm, title: e.target.value })
                }
            />
            <Label>Notes</Label>
            <Textarea
                value={editDeliverableForm.notes}
                onChange={(e) =>
                setEditDeliverableForm({ ...editDeliverableForm, notes: e.target.value })
                }
            />
            </div>
            <DialogFooter>
            <Button onClick={handleEditDeliverable}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!createForProjectId} onOpenChange={(val) => !val && setCreateForProjectId(null)}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create New Deliverable</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <Label>Title</Label>
            <Input
                value={newDeliverableForm.title}
                onChange={(e) => setNewDeliverableForm({ ...newDeliverableForm, title: e.target.value })}
            />
            <Label>Notes</Label>
            <Textarea
                value={newDeliverableForm.notes}
                onChange={(e) => setNewDeliverableForm({ ...newDeliverableForm, notes: e.target.value })}
            />
            </div>
            <DialogFooter>
            <Button onClick={handleCreateDeliverable}>Create</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
