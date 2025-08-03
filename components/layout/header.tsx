"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const router = useRouter()
  const { toast } = useToast() // ✅ Get toast function

const handleLogout = async () => {
  const { error } = await signOut()

  if (error) {
    toast({
      title: "Logout failed",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  toast({
    title: "Logged out",
    description: "You have been successfully logged out.",
  })

  router.push("/login")
}

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card/30 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clients, projects..."
            className="pl-10 bg-background/50 border-border/50 focus:border-pink-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative hover:bg-accent/50">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500">
                  <User className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card/90 backdrop-blur-xl border-border/50" align="end">
            <DropdownMenuLabel className="font-montserrat">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-pink-500 hover:text-pink-400">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
