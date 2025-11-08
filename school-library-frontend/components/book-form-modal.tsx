"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BookFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
  mode: "create" | "edit"
}

export function BookFormModal({ open, onOpenChange, onSubmit, initialData, mode }: BookFormModalProps) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      author: "",
      category: "",
      isbn: "",
      stock: 0,
      status: "available",
    },
  )

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData)
      } else {
        setFormData({
          title: "",
          author: "",
          category: "",
          isbn: "",
          stock: 0,
          status: "available",
        })
      }
    }
  }, [open, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tambah Buku Baru" : "Edit Buku"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Masukkan informasi buku baru" : "Perbarui informasi buku"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Buku</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan judul buku"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Penulis</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Masukkan nama penulis"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Masukkan kategori"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Masukkan nomor ISBN"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Masukkan jumlah stok"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="available">Tersedia</option>
              <option value="borrowed">Dipinjam</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {mode === "create" ? "Tambah" : "Simpan"} Buku
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
