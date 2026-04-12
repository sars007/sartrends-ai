"use client"

import Link from 'next/link'
import { LogOut, Home, Truck, FileText, Image, Globe, BookOpen, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <Truck className="h-8 w-8" />
              <span>Sartrends</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard/loadboard" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                <Truck className="h-4 w-4" />
                <span>Loadboard</span>
              </Link>
              <Link href="/dashboard/ai-tools" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                <Globe className="h-4 w-4" />
                <span>AI Tools</span>
              </Link>
              <Link href="/dashboard/course" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Course</span>
              </Link>
              <Link href="/dashboard/docs" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                <FileText className="h-4 w-4" />
                <span>Docs</span>
              </Link>
              <Link href="/dashboard/ads" className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors">
                <Image className="h-4 w-4" />
                <span>Ads</span>
              </Link>
            </div>
            <button className="p-2 text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/10">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
