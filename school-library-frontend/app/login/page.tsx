"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Library } from "lucide-react"

interface AuthResponse {
  data: {
    token: string
    user: {
      username: string
      authorities: string[]
    }
  }
  message: string
  statusCode: number
}

const gradientStyle = `
  .animated-gradient {
    background: linear-gradient(-45deg, #0d324d, #7f5a83, #1c4e80, #23a6d5);
    background-size: 400% 400%;
    animation: gradientBG 18s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Login gagal")
      }

      const token = (data as AuthResponse).data.token
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify((data as AuthResponse).data.user))

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Gunakan React.Fragment untuk membungkus style dan div
    <>
      {/* Tag <style> ini akan menyuntikkan CSS ke dalam <head>
        Kita gunakan dangerouslySetInnerHTML untuk memasukkan string CSS
      */}
      <style dangerouslySetInnerHTML={{ __html: gradientStyle }} />

      {/* Terapkan kelas .animated-gradient di sini */}
      <div className="min-h-screen flex items-center justify-center p-4 animated-gradient">
        
        <Card
          className="w-full max-w-md p-8 bg-black/20 backdrop-blur-lg border border-white/10 
                     shadow-xl text-white
                     animate-in fade-in-0 slide-in-from-bottom-5 duration-700"
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="p-3 bg-white/10 rounded-full mb-4 border border-white/10">
              <Library className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-center">
              School Library Login
            </h1>
          </div>

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Login Gagal</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full bg-white/5 border-white/20 text-white placeholder:text-neutral-300 focus-visible:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-white/5 border-white/20 text-white placeholder:text-neutral-300 focus-visible:ring-white"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-white/90 hover:bg-white/100 text-blue-900 font-bold text-base py-6
                         transition-all duration-300 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}