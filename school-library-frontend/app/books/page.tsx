"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Plus, Search } from "lucide-react"
import { BookFormModal } from "@/components/book-form-modal"
import { BookTable } from "@/components/BookTable"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export default function BooksPage() {
  const { role } = useAuth()
  const [books, setBooks] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true)
        const data = await api.getBooks()
        setBooks(data)
        setError("")
      } catch (err) {
        console.error("Failed to load books:", err)
        setError("Gagal memuat data buku. Pastikan backend berjalan di http://localhost:8080")
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddBook = () => {
    setModalMode("create")
    setSelectedBook(null)
    setModalOpen(true)
  }

  const handleEditBook = (book: any) => {
    setModalMode("edit")
    setSelectedBook(book)
    setModalOpen(true)
  }

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return
    }
    try {
      await api.deleteBook(bookId)
      setBooks((prev) => prev.filter((b) => b.id !== bookId))
    } catch (err) {
      console.error("Failed to delete book:", err)
      setError("Gagal menghapus buku")
    }
  }

  const handleSubmitBook = async (formData: any) => {
    try {
      if (modalMode === "create") {
        const newBook = await api.createBook(
          formData.isbn,
          formData.title,
          formData.author,
          formData.publisher,
          formData.publicationYear,
          formData.stock,
        )
        setBooks((prev) => [...prev, newBook])
      } else {
        const updatedBook = await api.updateBook(
          selectedBook.id,
          formData.isbn,
          formData.title,
          formData.author,
          formData.publisher,
          formData.publicationYear,
          formData.stock,
        )
        setBooks((prev) => prev.map((b) => (b.id === selectedBook.id ? updatedBook : b)))
      }
      setModalOpen(false)
      setSelectedBook(null)
    } catch (err) {
      console.error("Failed to submit book:", err)
      setError("Gagal menyimpan buku")
    }
  }

  if (loading) {
    return (
      <LayoutWrapper breadcrumbs={["Manajemen Buku"]}>
        <div className="p-6 text-center">Loading...</div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper breadcrumbs={["Manajemen Buku"]}>
      <div className="p-6">
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Manajemen Buku</h1>
            {role === "ADMIN" && (
              <Button
                onClick={handleAddBook}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold py-2 px-4"
              >
                <Plus className="w-5 h-5" />
                Tambah Buku Baru
              </Button>
            )}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul, penulis, atau ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-2"
            />
          </div>

          <BookTable
            books={filteredBooks}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            showActions={role === "ADMIN"}
          />
        </Card>
      </div>

      <BookFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmitBook}
        initialData={selectedBook}
        mode={modalMode}
      />
    </LayoutWrapper>
  )
}
