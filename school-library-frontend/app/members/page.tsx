"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, MoreHorizontal, Search, Loader2, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MemberFormModal } from "@/components/MemberFormModal"
import { Member, MemberFormData } from "@/types/member"

const API_URL = "/api/members"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState("")
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [currentMember, setCurrentMember] = useState<Member | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  async function fetchMembers() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) {
        throw new Error("Gagal mengambil data anggota dari server")
      }
      const response = await res.json()
      setMembers(response.data)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentMember(null)
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (member: Member) => {
    setModalMode("edit")
    setCurrentMember(member)
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Anda yakin ingin menghapus anggota ini?")) {
      return
    }

    setIsDeleting(id)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Gagal menghapus data")
      }
      
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
    } catch (err: any) {
      setError(err.message || "Gagal menghapus anggota.")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSubmit = async (formData: MemberFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const isEdit = modalMode === "edit"
    const url = isEdit ? `${API_URL}/${currentMember?.id}` : API_URL
    const method = isEdit ? "PUT" : "POST"

    const dataToSend = { ...formData }
    if (isEdit) {
      delete dataToSend.password
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal menyimpan data")
      }

      setModalOpen(false)
      fetchMembers()
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const normalizedSearch = search.toLowerCase()
  const filteredMembers = members.filter(
    (member) =>
      (member.name || '').toLowerCase().includes(normalizedSearch) ||
      (member.email || '').toLowerCase().includes(normalizedSearch) ||
      (member.username || '').toLowerCase().includes(normalizedSearch)
  )

  return (
    <LayoutWrapper breadcrumbs={["Manajemen Anggota"]}>
      <div className="p-6">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Anggota</h1>
            <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Tambah Anggota
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau username..."
              value={search}
              onChange={(e) => setSearch(e.g.target.value)}
              className="pl-10"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID Anggota</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nama</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Username</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Bergabung</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                     <tr className="border-b border-border">
                       <td colSpan={6} className="text-center py-4 text-muted-foreground">
                         {search ? "Anggota tidak ditemukan." : "Belum ada anggota."}
                       </td>
                     </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-4 font-medium">{member.memberId}</td>
                        <td className="py-3 px-4">{member.name}</td>
                        {/* --- PERBAIKAN DI SINI --- */}
                        <td className="py-3 px-4">{member.username}</td>
                        {/* --- AKHIR PERBAIKAN --- */}
                        <td className="py-3 px-4">{member.email}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{member.joinDate}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded" disabled={isDeleting === member.id}>
                                {isDeleting === member.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="w-4 h-4" />
                                )}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEdit(member)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(member.id)}>
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <MemberFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        initialData={currentMember}
        mode={modalMode}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    </LayoutWrapper>
  )
}