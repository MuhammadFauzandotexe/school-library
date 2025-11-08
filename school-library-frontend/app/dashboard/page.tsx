"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Book, Users, BookUp, AlertTriangle } from "lucide-react"

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
}

interface BookData {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  stock: number;
}

interface MemberData {
  id: number;
  memberId: string;
  name: string;
  email: string;
  joinDate: string;
}

interface RentData {
  id: number;
  rentDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  member: string;
  book: string;
}

async function fetchWithAuth(url: string) {
  const token = localStorage.getItem("authToken")

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {

      throw new Error("unauthorized")
    }
    const errorData = await response.json()
    throw new Error(errorData.message || "Gagal mengambil data")
  }

  const data = await response.json()
  return data.data 
}

export default function DashboardPage() {
  const router = useRouter()

  const [books, setBooks] = useState<BookData[]>([])
  const [members, setMembers] = useState<MemberData[]>([])
  const [rents, setRents] = useState<RentData[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rentData, memberData, bookData] = await Promise.all([
          fetchWithAuth("/api/rentals") as Promise<RentData[]>,
          fetchWithAuth("/api/members") as Promise<MemberData[]>,
          fetchWithAuth("/api/books") as Promise<BookData[]>,
        ])

        setRents(rentData)
        setMembers(memberData)
        setBooks(bookData)
      } catch (err: any) {
        if (err.message === "unauthorized") {
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          router.push("/login")
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router]) 
  const stats = [
    { label: "Total Buku", value: books.length, icon: Book, color: "bg-blue-500" },
    { label: "Total Anggota", value: members.length, icon: Users, color: "bg-purple-500" },
    {
      label: "Buku Dipinjam",
      value: rents.filter((r) => r.status === "BORROWED").length,
      icon: BookUp,
      color: "bg-green-500",
    },
    {
      label: "Buku Terlambat",
      value: rents.filter((r) => r.status === "OVERDUE").length,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ]

  const newBooks = books.slice(0, 3)
  const recentActivity = rents.slice(0, 5) 
  const rentStatusMap: Record<RentData["status"], { text: string; variant: "default" | "destructive" | "secondary" }> = {
    RETURNED: { text: "Dikembalikan", variant: "default" },
    OVERDUE: { text: "Terlambat", variant: "destructive" },
    BORROWED: { text: "Dipinjam", variant: "secondary" },
  }

  if (loading) {
    return <DashboardLoadingSkeleton />
  }

  if (error) {
    return (
      <LayoutWrapper breadcrumbs={["Dashboard"]}>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper breadcrumbs={["Dashboard"]}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Buku Baru Ditambahkan</h2>
            <div className="space-y-3">
              {newBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between items-start pb-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <Badge variant={book.stock > 0 ? "default" : "secondary"}>
                    {book.stock > 0 ? "Tersedia" : "Dipinjam"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Aktivitas Peminjaman Terakhir</h2>
            <div className="space-y-3">
              {recentActivity.map((rent) => {
                const statusInfo = rentStatusMap[rent.status]
                return (
                  <div
                    key={rent.id}
                    className="flex justify-between items-start pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{rent.member}</p>
                      <p className="text-sm text-muted-foreground">{rent.book}</p>
                    </div>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.text}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}

function DashboardLoadingSkeleton() {
  return (
    <LayoutWrapper breadcrumbs={["Dashboard"]}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}