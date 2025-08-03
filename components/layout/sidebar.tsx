"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  FileText,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Files", href: "/files", icon: FileText },
  { name: "AI Summary", href: "/ai-summary", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-montserrat font-semibold text-lg">ClientHub</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onToggle} className="ml-auto hover:bg-accent/50">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover:scale-105",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30",
                  )}
                >
                  <item.icon className={cn("w-4 h-4", collapsed ? "mr-0" : "mr-3")} />
                  {!collapsed && <span className="animate-slide-in font-medium">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
