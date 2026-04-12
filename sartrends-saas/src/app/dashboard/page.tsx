"use client"

import Link from 'next/link'
import { Truck, Zap, FileText, Image, Globe, BookOpen, Shield, DollarSign } from 'lucide-react'

const features = [
  {
    title: 'Loadboard',
    description: 'Real-time USA/UK/Canada loads, smart filters, broker contacts',
    icon: Truck,
    href: '/dashboard/loadboard',
    price: '$30/month'
  },
  {
    title: 'AI Tools',
    description: 'Chat AI, resume generator, cover letters, HSE docs',
    icon: Zap,
    href: '/dashboard/ai-tools',
    price: '$10/month'
  },
  {
    title: '2D/3D Ads',
    description: 'AI banner/mockup generator with editable canvas',
    icon: Image,
    href: '/dashboard/ads',
    price: '$75-200/month'
  },
  {
    title: 'Website Builder',
    description: 'AI website/store builder',
    icon: Globe,
    href: '/dashboard/website-builder',
    price: '$100/month'
  },
  {
    title: 'Dispatch Course',
    description: 'Lifetime truck dispatch training ($30 one-time)',
    icon: BookOpen,
    href: '/dashboard/course',
    price: '$30 lifetime'
  },
  {
    title: 'HSE Documents',
    description: 'AI safety reports & policies',
    icon: Shield,
    href: '/dashboard/hse',
    price: '$75/month'
  }
]

export default function DashboardPage() {
  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-6">
          Welcome to Sartrends AI
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Enterprise loadboard + AI tools for truckers, brokers, dispatchers. Device-locked security.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link key={index} href={feature.href} className="group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <feature.icon className="h-12 w-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 px-4 py-2 rounded-xl font-semibold">
                  {feature.price}
                </span>
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
