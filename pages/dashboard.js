import { useEffect, useState } from 'react'
import { callAPI } from '../lib/api'

export default function Dashboard() {
  const [token, setToken] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [aiType, setAiType] = useState('chat')
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token') || ''
      if (!savedToken) {
        window.location.href = '/'
        return
      }
      setToken(savedToken)
      checkSubscription(savedToken)
    }
  }, [])

  const checkSubscription = async (token) => {
    const result = await callAPI('/api/users/me')
    if (result.error) {
      setSubscription(null)
    } else {
      setSubscription(result)
    }
  }

  const callAI = async () => {
    setLoading(true)
    const result = await callAPI(`/api/ai/${aiType === 'chat' ? '' : aiType}`, {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        ...(aiType === 'resume' || aiType === 'cover' ? { details: userDetails, jobTitle, company } : {})
      })
    })
    
    if (result.error) {
      setResponse(`Error: ${result.message}`)
    } else {
      setResponse(result.response || result.result || result || 'No response')
    }
    setLoading(false)
  }

  if (!token) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🚀 Sartrends AI Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-2xl mb-4">AI Generator</h2>
            <select value={aiType} onChange={(e) => setAiType(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl mb-4">
              <option value="chat">Chatbot</option>
              <option value="resume">Resume</option>
              <option value="cover">Cover Letter</option>
<option value="website">Website Builder</option>
              <option value="ads">Ads Generator</option>
            </select>
            {aiType === 'chat' && (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything..."
                className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl mb-4 h-32"
              />
            )}
            {(aiType === 'resume' || aiType === 'cover') && (
              <>
                <input
                  value={userDetails}
                  onChange={(e) => setUserDetails(e.target.value)}
                  placeholder="Your experience, skills..."
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl mb-4"
                />
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl mb-4"
                />
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl mb-4"
                />
              </>
            )}
            <button
              onClick={callAI}
              disabled={loading || !prompt}
              className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            {response && (
              <div className="mt-6 p-6 bg-gray-900 rounded-2xl max-h-96 overflow-auto">
                <h3 className="font-bold mb-2">Output:</h3>
                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
              </div>
            )}
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-2xl mb-4">Quick Actions</h2>
            <a href="/billing" className="block p-4 bg-green-600 hover:bg-green-500 rounded-xl mb-4 text-center">💳 Billing</a>
            <a href="https://wa.me/923454837460" className="block p-4 bg-green-500 hover:bg-green-400 rounded-xl text-center">📱 WhatsApp Support</a>
            <a href="/ads" className="block p-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-center">🖼️ Ads Generator</a>
            <p className="mt-4 text-sm opacity-75">Subscription: {subscription ? 'Active' : 'Upgrade needed'}</p>

          </div>
        </div>
      </div>
    </div>
  )
}

