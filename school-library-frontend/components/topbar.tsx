"use client"

import { ChevronRight, MoreVertical, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface StoredUser {
  id: string
  username: string
  authorities: string[]
}

interface TopbarProps {
  breadcrumbs: string[]
}

export function Topbar({ breadcrumbs }: TopbarProps) {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    const storedUserJson = localStorage.getItem("user")
    if (storedUserJson) {
      setUser(JSON.parse(storedUserJson))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const userRole = user?.authorities[0] || null

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {crumb}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {userRole && (
          <Badge variant="outline" className="text-sm font-medium capitalize">
            Role: {userRole.toLowerCase()}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <span className="font-medium capitalize">
                👤 {user ? user.username : "..."}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:bg-red-500/10 focus:text-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}