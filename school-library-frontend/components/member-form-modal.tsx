"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface MemberFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
  isEdit?: boolean
}

export function MemberFormModal({ isOpen, onClose, onSubmit, initialData, isEdit }: MemberFormModalProps) {
  const [formData, setFormData] = useState(
    initialData || {
      memberId: "",
      name: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      memberId: "",
      name: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Anggota" : "Tambah Anggota Baru"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID Anggota</label>
            <Input
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              placeholder="M-001"
              disabled={isEdit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama anggota"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Bergabung</label>
            <Input
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              disabled={isEdit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Simpan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
