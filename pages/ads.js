import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { callAPI } from '../lib/api'

export default function Ads() {
  const [token, setToken] = useState('')
  const [adPrompt, setAdPrompt] = useState('')
  const [ads, setAds] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      router.push('/')
      return
    }
    setToken(savedToken)
  }, [router])

  const generateAds = async () => {
    setLoading(true)
    const result = await callAPI('/api/ai/ads', {
      method: 'POST',
      body: JSON.stringify({ prompt: adPrompt, type: '2D' })
    })
    
    if (result.error) {
      setAds(`Error: ${result.message}`)
    } else if (result.image) {
      setAds(<img src={result.image} alt="Generated ad" className="max-w-full rounded-lg mt-4" />)
    } else {
      setAds(result.ad || result.result || result || 'No ad generated')
    }
    setLoading(false)
  }

  if (!token) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎯 AI Ad Generator</h1>
        
        <div className="bg-gray-900 p-8 rounded-3xl">
          <textarea
            value={adPrompt}
            onChange={(e) => setAdPrompt(e.target.value)}
            placeholder="Describe your trucking business, load type, or service..."
            className="w-full p-6 bg-gray-800 border border-gray-600 rounded-2xl mb-6 h-32 text-white"
          />
          
          <button
            onClick={generateAds}
            disabled={loading || !adPrompt}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-6 rounded-2xl font-bold text-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Generating Ads...' : '🚀 Generate Facebook/Google Ads'}
          </button>
          
          {ads && (
            <div className="mt-8 p-8 bg-gray-900/50 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">📢 Generated Ads:</h3>
              <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {ads}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(ads)}
                className="mt-4 bg-green-600 hover:bg-green-500 px-6 py-2 rounded-xl font-bold"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center opacity-75">
          <p>Pro tip: Include route, rate per mile, truck type for better ads</p>
        </div>
      </div>
    </div>
  )
}

