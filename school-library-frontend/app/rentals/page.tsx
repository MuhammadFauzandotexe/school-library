"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, MoreHorizontal, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RentalFormModal } from "@/components/rental-form-modal"
import { ReturnRentalModal } from "@/components/return-rental-modal"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export default function RentalsPage() {
  const { role } = useAuth()
  const [rents, setRents] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(role);
        setLoading(true)
        const [rentalsData, membersData, booksData] = await Promise.all([
          api.getRentals(),
          api.getMembers(),
          api.getBooks(),
        ])
        setRents(rentalsData)
        setMembers(membersData)
        setBooks(booksData)
        setError("")
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Gagal memuat data. Pastikan backend berjalan di http://localhost:8080")
      } finally {
        setLoading(false)
      }
      console.log(role)
    }
  
    loadData()
  }, [])

  const handleAddRental = () => {
    setIsRentalModalOpen(true)
  }

  const handleReturnRental = (rental: any) => {
    console.log("rentallll")
    console.log(rental)
    setSelectedRental(rental)
    setIsReturnModalOpen(true)
  }

  const handleDeleteRental = async (rentId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
      return
    }
    try {
      await fetch(`http://localhost:8080/api/rentals/${rentId}`, {
        method: "DELETE",
      })
      setRents(rents.filter((rent) => rent.id !== rentId))
    } catch (err) {
      console.error("Failed to delete rental:", err)
      setError("Gagal menghapus peminjaman")
    }
  }

  const handleSubmitRental = async (formData: any) => {
    try {
      const newRental = await api.createRental(formData.memberId, formData.bookId, formData.dueDate)
      setRents([...rents, newRental])
      setIsRentalModalOpen(false)
    } catch (err) {
      console.error("Failed to create rental:", err)
      setError("Gagal membuat peminjaman")
    }
  }

  const handleConfirmReturn = async (returnData: any) => {
    console.log(returnData)
    try {
      const updated = await api.returnRental(returnData.rentId, returnData.returnDate)
      setRents(rents.map((rent) => (rent.id === returnData.rentId ? updated : rent)))
      setIsReturnModalOpen(false)
      setSelectedRental(null)
    } catch (err) {
      console.error("Failed to return rental:", err)
      setError("Gagal mengembalikan buku")
    }
  }

  const filteredRents = rents.filter(
    (rent) =>
      rent.member.toLowerCase().includes(search.toLowerCase()) ||
      rent.book.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <LayoutWrapper breadcrumbs={["Manajemen Peminjaman"]}>
        <div className="p-6 text-center">Loading...</div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper breadcrumbs={["Manajemen Peminjaman"]}>
      <div className="p-6">
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Peminjaman</h1>
            {role === "ADMIN" && (
              <Button onClick={handleAddRental} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Tambah Peminjaman
              </Button>
            )}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anggota atau buku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID Peminjaman</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Anggota</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Buku</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tanggal Pinjam</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tanggal Kembali</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                  {role === "ADMIN"&& (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRents.length > 0 ? (
                  filteredRents.map((rent) => (
                    <tr key={rent.id} className="border-b border-border hover:bg-muted">
                      <td className="py-3 px-4 font-medium">#{rent.id}</td>
                      <td className="py-3 px-4">{rent.member}</td>
                      <td className="py-3 px-4">{rent.book}</td>
                      <td className="py-3 px-4 text-sm">{rent.rentDate}</td>
                      <td className="py-3 px-4 text-sm">{rent.returnDate || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            rent.status === "RETURNED"
                              ? "default"
                              : rent.status === "OVERDUE"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {rent.status === "RETURNED"
                            ? "Dikembalikan"
                            : rent.status === "OVERDUE"
                              ? "Terlambat"
                              : "Dipinjam"}
                        </Badge>
                      </td>
                      {role === "ADMIN" && (
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MoreHorizontal className="w-4 h-4 text-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {rent.status !== "RETURNED" && (
                                <DropdownMenuItem onClick={() => handleReturnRental(rent)}>
                                  Konfirmasi Kembali
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === "ADMIN" ? 7 : 6} className="text-center py-10 text-muted-foreground">
                      Tidak ada data peminjaman ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <RentalFormModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        onSubmit={handleSubmitRental}
        books={books}
        members={members}
      />

      <ReturnRentalModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSubmit={handleConfirmReturn}
        rentalData={selectedRental}
      />
    </LayoutWrapper>
  )
}
