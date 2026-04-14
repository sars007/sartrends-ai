import { useState } from 'react'

export default function Billing() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')

  if (typeof window === 'undefined') return null

  const tokenFromStorage = localStorage.getItem('token')
  if (!tokenFromStorage) {
    window.location.href = '/'
    return null
  }

  const submitPayment = async () => {
    if (!file) return setMessage('Select proof image')
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenFromStorage}` },
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Payment submitted! Wait for admin approval.')
      } else {
        setMessage('Error: ' + data.error)
      }
    } catch (e) {
      setMessage('Upload failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-8 text-white">
      <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">💳 Billing</h1>
        <p className="mb-6 text-center opacity-75">Upload payment proof (EasyPaisa/Meezan)</p>
        <p className="mb-4 p-3 bg-yellow-900/50 rounded-xl text-xs">
          EasyPaisa: +923454837460<br/>
          Meezan: 77010105779192<br/>
          IBAN: PK59MEZN0077010105779192
        </p>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl mb-4"
          accept="image/*"
        />
        <button
          onClick={submitPayment}
          disabled={!file || loading}
          className="w-full bg-green-600 hover:bg-green-500 p-4 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Submit Proof'}
        </button>
        {message && (
          <p className="mt-4 p-3 bg-green-900/50 rounded-xl text-center font-bold">{message}</p>
        )}
        <div className="mt-8 text-center text-sm opacity-75">
          <a href="https://wa.me/923454837460" className="text-blue-400 hover:underline">WhatsApp for questions</a>
        </div>
      </div>
    </div>
  )
}

