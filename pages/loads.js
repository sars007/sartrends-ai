import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Map, GoogleApiWrapper, Marker } from '@googlemaps/react-wrapper'

export default function Loads({ token }) {
  const [loads, setLoads] = useState([])
  const [liveDrivers, setLiveDrivers] = useState({})
  const [socket, setSocket] = useState(null)
  const [tokenState, setTokenState] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) window.location.href = '/'
    setTokenState(savedToken)
    fetchLoads(savedToken)
    initSocket(savedToken)
    return () => socket?.disconnect()
  }, [])

  const fetchLoads = async (token) => {
    const res = await fetch('/api/loads', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setLoads(await res.json())
  }

  const initSocket = (token) => {
    const newSocket = io('/', { auth: { token } })
    setSocket(newSocket)

    newSocket.on('live-location', (data) => {
      setLiveDrivers(prev => ({ ...prev, [data.driverId]: data.location }))
    })

    // Simulate driver location every 5s
    const interval = setInterval(() => {
      newSocket.emit('driver-location', {
        driverId: 'driver1',
        location: { lat: 41.8781 + (Math.random()-0.5)*0.01, lng: -87.6298 + (Math.random()-0.5)*0.01 },
        status: 'online'
      })
    }, 5000)

    return () => clearInterval(interval)
  }

  const mapContainerStyle = {
    height: '400px',
    width: '100%'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">🚚 Live Loadboard + GPS Tracking</h1>
          <div className="text-xl opacity-75">Drivers online: {Object.keys(liveDrivers).length}</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">📋 Active Loads</h2>
            <div className="max-h-96 overflow-auto space-y-4">
              {loads.map(load => (
                <div key={load.id} className="bg-gray-800 p-6 rounded-2xl hover:bg-gray-700/50 transition-all">
                  <div className="font-bold text-lg mb-2">{load.brokerName}</div>
                  <div className="text-blue-400 mb-2">{load.origin} → {load.destination}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm opacity-75 mb-2">
                    <span>Miles: {load.miles.toLocaleString()}</span>
                    <span className="text-green-400 font-bold">${load.rate.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold">
                      ${load.ratePerMile}/mile - {load.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">🗺️ Live GPS Tracking</h2>
            <div className="h-96 rounded-2xl overflow-hidden bg-black/50 relative">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <p>Live driver tracking</p>
                  <p className="text-sm opacity-75">Socket.io broadcasting</p>
                </div>
              </div>
              {liveDrivers.driver1 && (
                <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-xl text-black font-bold shadow-2xl z-20">
                  Driver1: {liveDrivers.driver1.lat.toFixed(4)}, {liveDrivers.driver1.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center opacity-75">
          <p>Real-time updates via WebSockets. Driver locations update live every 5s (demo).</p>
        </div>
      </div>
    </div>
  )
}

