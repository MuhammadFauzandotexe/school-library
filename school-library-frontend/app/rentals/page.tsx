"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, MoreHorizontal, Search, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RentalFormModal } from "@/components/rental-form-modal"
import { ReturnRentalModal } from "@/components/return-rental-modal"
import { toast } from "sonner" // Asumsi Anda menggunakan sonner/react-hot-toast untuk notifikasi

// Definisikan base URL API Anda
const API_BASE_URL = "http://localhost:8080/api"

export default function RentalsPage() {
  const [rents, setRents] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState("")
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState(null)

  // Fungsi untuk mengambil semua data peminjaman
  const fetchRentals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals`) // Sesuaikan dengan URL controller Anda
      if (!response.ok) throw new Error("Gagal mengambil data peminjaman")
      const result = await response.json()
      setRents(result.data || [])
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk mengambil data buku & anggota (untuk modal)
  const fetchDependencies = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/books`),
        fetch(`${API_BASE_URL}/members`),
      ])

      if (!booksRes.ok) throw new Error("Gagal mengambil data buku")
      if (!membersRes.ok) throw new Error("Gagal mengambil data anggota")

      const booksResult = await booksRes.json()
      const membersResult = await membersRes.json()

      setBooks(booksResult.data || [])
      setMembers(membersResult.data || [])
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    }
  }

  // Ambil semua data saat komponen dimuat
  useEffect(() => {
    setLoading(true) // Set loading ke true di awal
    Promise.all([
      fetchRentals(),
      fetchDependencies()
    ]).catch((err) => {
        // Handle error global jika diperlukan, meskipun fetch individu sudah punya
        console.error("Gagal memuat data dependensi", err)
    }).finally(() => {
        // setLoading(false) // Dihapus dari sini karena fetchRentals sudah mengaturnya
    });
  }, [])

  // Handler untuk Tambah Peminjaman (CREATE)
  const handleSubmitRental = async (formData) => {
    // formData seharusnya berisi: { memberId: ID, bookId: ID }
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // API Anda mengharapkan { memberId, bookId }
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Gagal menambahkan peminjaman")
      }

      const newRental = await response.json()
      // setRents([...rents, newRental.data]) // Sebaiknya fetch ulang untuk data konsisten
      await fetchRentals() // Panggil fetchRentals untuk data terbaru
      await fetchDependencies() // Panggil juga fetchDependencies untuk update stok buku
      
      setIsRentalModalOpen(false)
      toast.success("Buku berhasil dipinjam")
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Handler untuk Konfirmasi Pengembalian (UPDATE)
  const handleConfirmReturn = async (returnData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/return/${returnData.rentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Gagal mengembalikan buku")
      }

      const updatedRental = await response.json()

      // Update data di state
      setRents(rents.map((rent) =>
        rent.rentId === updatedRental.data.rentId ? updatedRental.data : rent
      ))
      
      await fetchDependencies() // Panggil juga fetchDependencies untuk update stok buku

      setIsReturnModalOpen(false)
      setSelectedRental(null)
      toast.success("Buku berhasil dikembalikan")
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Handler untuk Hapus Peminjaman (DELETE)
  const handleDeleteRental = async (rentId) => {
    // Ganti window.confirm dengan modal kustom jika ada, atau biarkan untuk saat ini
    if (!confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Gagal menghapus peminjaman")
      }

      // Hapus dari state
      setRents(rents.filter((rent) => rent.rentId !== rentId))
      toast.success("Data peminjaman berhasil dihapus")
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Fungsi utilitas untuk handler
  const handleAddRental = () => {
    setIsRentalModalOpen(true)
  }

  const handleReturnRental = (rental) => {
    setSelectedRental(rental)
    setIsReturnModalOpen(true)
  }

  // =================================================================
  // PERBAIKAN DI SINI
  // =================================================================
  // Logika filter dibuat lebih aman
  const filteredRents = rents.filter((rent) => {
    const memberName = rent?.member?.name || "" // Memberi nilai default string kosong
    const bookTitle = rent?.book?.title || "" // Memberi nilai default string kosong

    return (
      memberName.toLowerCase().includes(search.toLowerCase()) ||
      bookTitle.toLowerCase().includes(search.toLowerCase())
    )
  })
  // =================================================================

  if (error) {
    return <LayoutWrapper><div className="p-6 text-red-500">Error: {error}</div></LayoutWrapper>
  }

  return (
    <LayoutWrapper breadcrumbs={["Manajemen Peminjaman"]}>
      <div className="p-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Peminjaman</h1>
            <Button onClick={handleAddRental} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Tambah Peminjaman
            </Button>
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
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2">Memuat data...</span>
                </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Anggota</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Buku</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tgl Pinjam</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tgl Kembali</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRents.length > 0 ? (
                    filteredRents.map((rent) => (
                      <tr key={rent.rentId} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-4 font-medium">#{rent.rentId}</td>
                        {/* Tambahkan pengecekan keamanan di sini juga */}
                        <td className="py-3 px-4">{rent?.member?.name || "Anggota Dihapus"}</td>
                        <td className="py-3 px-4">{rent?.book?.title || "Buku Dihapus"}</td>
                        <td className="py-3 px-4 text-sm">{rent.rentDate}</td>
                        <td className="py-3 px-4 text-sm">{rent.returnDate || "-"}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              rent.status?.toLowerCase() === "returned" // Diperbarui
                                ? "default"
                                : rent.status?.toLowerCase() === "overdue" // Diperbarui
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {rent.status?.toLowerCase() === "returned"
                              ? "Dikembalikan"
                              : rent.status?.toLowerCase() === "overdue"
                                ? "Terlambat"
                                : "Dipinjam"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {rent.status?.toLowerCase() !== "returned" && (
                                <DropdownMenuItem onClick={() => handleReturnRental(rent)}>
                                  Konfirmasi Kembali
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteRental(rent.rentId)} // Diperbarui
                              >
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-muted-foreground">
                        Tidak ada data peminjaman ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Modal ini sekarang mendapatkan data buku dan anggota dari API */}
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