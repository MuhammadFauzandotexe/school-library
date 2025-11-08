"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ReturnRentalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  rentalData?: any
}

export function ReturnRentalModal({ isOpen, onClose, onSubmit, rentalData }: ReturnRentalModalProps) {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...rentalData, returnDate, status: "returned" })
    setReturnDate(new Date().toISOString().split("T")[0])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Pengembalian</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buku</label>
            <Input value={rentalData?.book || ""} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Anggota</label>
            <Input value={rentalData?.member || ""} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Peminjaman</label>
            <Input value={rentalData?.rentDate || ""} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Pengembalian</label>
            <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Batal
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Konfirmasi Pengembalian
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
