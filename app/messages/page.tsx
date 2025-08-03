"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Search, Send, Paperclip, MoreHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ProtectedRoute from "@/components/layout/protected-route"

const conversations = [
  {
    id: 1,
    client: "Acme Corporation",
    avatar: "/placeholder-user.jpg",
    lastMessage: "The logo concepts look great! I particularly like option 2.",
    timestamp: "2 hours ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    client: "TechStart Inc",
    avatar: "/placeholder-user.jpg",
    lastMessage: "When can we expect the wireframes?",
    timestamp: "1 day ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    client: "InnovateLab",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Perfect! The app design is exactly what we wanted.",
    timestamp: "3 days ago",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    client: "GrowthCo",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Can we schedule a call to discuss the marketing materials?",
    timestamp: "5 hours ago",
    unread: 1,
    online: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "Acme Corporation",
    content: "Hi! I wanted to follow up on the brand identity project. The initial concepts you shared look fantastic.",
    timestamp: "10:30 AM",
    isClient: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you! I'm glad you like the direction. I have a few more variations ready to show you.",
    timestamp: "10:45 AM",
    isClient: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    sender: "Acme Corporation",
    content:
      "The logo concepts look great! I particularly like option 2. Can we see some variations with different colors?",
    timestamp: "2:15 PM",
    isClient: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    sender: "You",
    content: "I'll prepare some color variations for option 2. Should have them ready by tomorrow.",
    timestamp: "2:30 PM",
    isClient: false,
    avatar: "/placeholder-user.jpg",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedClient = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
  <ProtectedRoute>
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Conversations List */}
        <Card className="w-80 glass-effect animate-slide-in">
          <CardHeader className="pb-3">
            <CardTitle className="font-montserrat">Messages</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-pink-500/50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-background/50 ${
                      selectedConversation === conversation.id
                        ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.client} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                          {conversation.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.client}</h4>
                        {conversation.unread > 0 && (
                          <Badge className="bg-pink-500 text-white text-xs">{conversation.unread}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 glass-effect animate-fade-in flex flex-col">
          {selectedClient && (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} alt={selectedClient.client} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                          {selectedClient.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedClient.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold">{selectedClient.client}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedClient.online ? "Online" : "Last seen " + selectedClient.timestamp}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-20rem)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex space-x-3 ${message.isClient ? "" : "flex-row-reverse space-x-reverse"}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs">
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 max-w-xs ${message.isClient ? "" : "text-right"}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.isClient
                                ? "bg-background/50"
                                : "bg-gradient-to-r from-pink-500/20 to-purple-500/20"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-background/50 border-border/50 focus:border-pink-500/50 resize-none"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  </ProtectedRoute>
  )
}
