"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ValidRole = "librarian" | "ADMIN" | "USER"

interface StorageUser {
  id: string
  username: string
  authorities: string[]
}

interface AuthContextType {
  role: ValidRole
  setRole: (role: ValidRole) => void 
  user: { name: string } | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<ValidRole>("USER") 
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const userString = localStorage.getItem("user")

      console.log(userString)

      if (userString) {
        const userData: StorageUser = JSON.parse(userString)
        
        console.log(userData);

        const userRole = userData?.authorities?.[0]

        if (userData.username && userRole) {
          
          if (["librarian", "ADMIN", "USER"].includes(userRole)) {
            
            setUser({ name: userData.username })
            setRole(userRole as ValidRole)
            setIsAuthenticated(true)
            console.log(userRole)
            
          } else {
            console.warn("User role from localStorage is not recognized:", userRole)
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      setIsAuthenticated(false)
      setUser(null)
      setRole("USER")
    }
  }, [])

  const handleSetRole = (newRole: ValidRole) => {
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