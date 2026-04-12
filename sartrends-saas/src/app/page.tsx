"use client"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-8">
          Sartrends AI SaaS
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Enterprise loadboard + AI platform for truckers, brokers, dispatchers. 
          Device-locked security, subscriptions, auto blogs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 inline-block"
          >
            Get Started Free
          </a>
          <a
            href="https://wa.me/923454837460"
            className="border-2 border-white/30 hover:border-white text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/10 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300 inline-block"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  )
}
