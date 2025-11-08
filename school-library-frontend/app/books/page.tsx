"use client"

import { useState, useEffect } from "react"
import { Book } from "@/types/book"
import { BookFormModal } from "@/components/BookFormModal"
import { BookTable } from "@/components/BookTable"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Loader2, Plus } from "lucide-react"
import { LayoutWrapper } from "@/components/layout-wrapper" // Ini sudah benar

const API_URL = "/api/books"

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [currentBook, setCurrentBook] = useState<Book | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  async function fetchBooks() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) {
        throw new Error("Gagal mengambil data dari server")
      }
      const response = await res.json()
      setBooks(response.data)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentBook(null)
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (book: Book) => {
    setModalMode("edit")
    setCurrentBook(book)
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Anda yakin ingin menghapus buku ini?")) {
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

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
    } catch (err: any) {
      setError(err.message || "Gagal menghapus buku.")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSubmit = async (formData: Book) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const isEdit = modalMode === "edit"
    const url = isEdit ? `${API_URL}/${currentBook?.id}` : API_URL
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal menyimpan data")
      }

      setModalOpen(false)
      fetchBooks()
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <LayoutWrapper breadcrumbs={["Manajemen Buku"]}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manajemen Buku</h1>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Buku
          </Button>
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
          <BookTable
            books={books}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}

        <BookFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmit={handleSubmit}
          initialData={currentBook}
          mode={modalMode}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      </div>
    </LayoutWrapper>
  )
}