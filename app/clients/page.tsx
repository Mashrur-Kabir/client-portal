"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Search, Plus, MessageSquare, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ProtectedRoute from "@/components/layout/protected-route"
import { useToast } from "@/hooks/use-toast"
import { checkIfEmailExists } from "@/lib/utils"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

interface Client {
  id: string
  name: string
  email: string
  status?: string
  phone?: string
  company?: string
  avatar?: string
  projects?: number
  lastActivity?: string
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState<string | null>(null)
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "" })
  const [adding, setAdding] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const fetchClients = async () => {
    setLoading(true)
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to load clients",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      })
    } else {
      setClients(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.company || ""
    })
    setOpen(true)
  }

  const handleDelete = (clientId: string) => {
    // Just store the ID of the client you want to delete,
    // this will open the confirmation dialog
    setConfirmDeleteClientId(clientId);
  };


  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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
              <h1 className="text-3xl font-montserrat font-bold">Clients</h1>
              <p className="text-muted-foreground mt-2">Manage your client relationships</p>
            </div>
            <Dialog open={open} onOpenChange={(v) => {
              setOpen(v)
              if (!v) {
                setEditingClient(null)
                setNewClient({ name: "", email: "", phone: "", company: "" })
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect border border-border/30 backdrop-blur-xl animate-fade-in space-y-6">
                <DialogTitle className="text-xl font-semibold font-montserrat">
                  {editingClient ? "Edit Client" : "Add New Client"}
                </DialogTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm block mb-1">Name</label>
                    <Input
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Email</label>
                    <Input
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="client@example.com"
                      disabled={!!editingClient}
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Phone</label>
                    <Input
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="+880..."
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Company</label>
                    <Input
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <Button
                  className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
                  disabled={adding}
                  onClick={async () => {
                    if (!newClient.name || !newClient.email) {
                      toast({
                        variant: "destructive",
                        title: "Missing Information",
                        description: "Client name and email are required",
                        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      })
                      return
                    }
                    setAdding(true)

                    if (!editingClient) {
                      const isValidEmail = await checkIfEmailExists(newClient.email)
                      if (!isValidEmail) {
                        toast({
                          variant: "destructive",
                          title: "Email not registered",
                          description: "Client must be a registered user.",
                          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        })
                        setAdding(false)
                        return
                      }
                    }

                    let error
                    if (editingClient) {
                      ({ error } = await supabase.from("clients")
                        .update({
                          name: newClient.name,
                          email: newClient.email,
                          phone: newClient.phone,
                          company: newClient.company
                        })
                        .eq("id", editingClient.id))
                    } else {
                      const {
                        data: { user },
                        error: userError
                      } = await supabase.auth.getUser()

                      if (userError || !user) {
                        toast({
                          variant: "destructive",
                          title: "Failed to identify current user",
                          description: "Please refresh and try again.",
                          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        })
                        setAdding(false)
                        return
                      }

                      const { error: insertError } = await supabase.from("clients").insert({
                        user_id: user.id,
                        name: newClient.name,
                        email: newClient.email,
                        phone: newClient.phone,
                        company: newClient.company
                      })

                      error = insertError
                    }

                    if (error) {
                      toast({
                        variant: "destructive",
                        title: editingClient ? "Failed to update client" : "Failed to add client",
                        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      })
                    } else {
                      toast({
                        variant: "default",
                        title: editingClient ? "Client updated" : "Client added",
                        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-300"
                      })
                      fetchClients()
                      setOpen(false)
                      setEditingClient(null)
                      setNewClient({ name: "", email: "", phone: "", company: "" })
                    }

                    setAdding(false)
                  }}
                >
                  {adding ? (editingClient ? "Updating..." : "Adding...") : (editingClient ? "Update Client" : "Add Client")}
                </Button>
              </DialogContent>
            </Dialog>

            <Dialog open={!!confirmDeleteClientId} onOpenChange={(v) => !v && setConfirmDeleteClientId(null)}>
              <DialogContent className="glass-effect border border-border/30 backdrop-blur-xl animate-fade-in space-y-4 text-center">
                <DialogTitle className="text-xl font-semibold font-montserrat">Confirm Deletion</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to delete this client? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDeleteClientId(null)}
                    className="hover:scale-105 transition"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="hover:scale-105 transition"
                    onClick={async () => {
                      if (!confirmDeleteClientId) return
                      const { error } = await supabase.from("clients").delete().eq("id", confirmDeleteClientId)
                      if (error) {
                        toast({
                          title: "Failed to delete client",
                          description: error.message,
                          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        })
                      } else {
                        toast({
                          title: "Delete successful",
                          description: "The client is removed",
                          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-300"
                        })
                        fetchClients()
                      }
                      setConfirmDeleteClientId(null)
                    }}
                  >
                    Yes, Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

          </div>

          {/* Search */}
          <Card className="glass-effect animate-slide-in">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-pink-500/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && filteredClients.length === 0 ? (
              <p className="text-muted-foreground text-sm animate-fade-in">No clients found.</p>
            ) : (
              filteredClients.map((client, index) => (
                <Card
                  key={client.id}
                  className="glass-effect hover:scale-105 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar || "/placeholder-user.jpg"} alt={client.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{client.name}</CardTitle>
                          <CardDescription className="text-sm">{client.email}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card/90 backdrop-blur-xl border-border/50">
                          <DropdownMenuItem onClick={() => handleEdit(client)}>Edit Client</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400" onClick={() => handleDelete(client.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(client.status || "Active")}>
                        {client.status || "Active"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {client.projects ?? 0} projects
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Last activity: {client.lastActivity || "—"}
                    </p>

                    <div className="flex space-x-2">
                      <Link href={`/clients/${client.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full hover:bg-accent/50 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Portal
                        </Button>
                      </Link>
                      <Link href={`/messages?client=${client.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-accent/50 bg-transparent">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
