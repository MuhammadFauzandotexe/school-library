"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface RentalFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  books: any[]
  members: any[]
}

export function RentalFormModal({ isOpen, onClose, onSubmit, books, members }: RentalFormModalProps) {
  const [formData, setFormData] = useState({
    memberId: "",
    bookId: "",
    dueDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        memberId: "",
        bookId: "",
        dueDate: new Date().toISOString().split("T")[0],
      })
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.memberId || !formData.bookId) {
      alert("Mohon lengkapi semua field")
      return
    }
    onSubmit({
      memberId: Number.parseInt(formData.memberId),
      bookId: formData.bookId,
      dueDate: formData.dueDate,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Buat Peminjaman Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Anggota</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              required
            >
              <option value="">-- Pilih Anggota --</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Buku</label>
            <select
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              required
            >
              <option value="">-- Pilih Buku --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Jatuh Tempo</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Buat Peminjaman
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
