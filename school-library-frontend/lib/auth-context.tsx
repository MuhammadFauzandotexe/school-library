"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  role: "admin" | "librarian"
  setRole: (role: "admin" | "librarian") => void
  user: { name: string } | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"admin" | "librarian">("librarian")
  const [user, setUser] = useState<{ name: string } | null>({ name: "Admin User" })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as "admin" | "librarian" | null
    const savedAuth = localStorage.getItem("isAuthenticated") === "true"

    if (savedRole) setRole(savedRole)
    if (savedAuth) setIsAuthenticated(true)
  }, [])

  const handleSetRole = (newRole: "admin" | "librarian") => {
    setRole(newRole)
    localStorage.setItem("userRole", newRole)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
