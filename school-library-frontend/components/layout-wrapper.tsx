"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface LayoutWrapperProps {
  children: React.ReactNode
  breadcrumbs: string[]
}

export function LayoutWrapper({ children, breadcrumbs }: LayoutWrapperProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Topbar breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
