import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from '@googlemaps/react-wrapper'
import { useRouter } from 'next/router'
import { callAPI } from '../lib/api'

const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyB9u1u...' // Add your key

export default function Loads({ google }) {
  const [loads, setLoads] = useState([])
  const [token, setToken] = useState('')
  const [selectedLoad, setSelectedLoad] = useState(null)
  const [socket, setSocket] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      router.push('/')
      return
    }
    setToken(savedToken)
    fetchLoads(savedToken)
    
    const newSocket = io()
    setSocket(newSocket)
    
    return () => newSocket.close()
  }, [router])

  const fetchLoads = async () => {
    const result = await callAPI('/api/loads')
    setLoads(Array.isArray(result) ? result : [])
  }

  const mapStyles = {
    width: '100%',
    height: '500px'
  }

  if (!token) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            🚛 Live Loadboard
          </h1>
          <button 
            onClick={fetchLoads}
            className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            🔄 Refresh Loads
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Loads List */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 max-h-[70vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-8">📋 Available Loads ({loads.length})</h2>
            {loads.map(load => (
              <div key={load.id} className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-2xl mb-4 border border-gray-600 cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => setSelectedLoad(load)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <div><span className="font-bold">From:</span> {load.origin}</div>
                  <div><span className="font-bold">To:</span> {load.destination}</div>
                  <div><span className="font-bold">Miles:</span> {load.miles?.toFixed(0) || 'N/A'}</div>
                  <div><span className="font-bold">Rate:</span> ${load.rate || 'N/A'}</div>
                </div>
                <div className="text-sm opacity-75">
                  {load.brokerName && `Broker: ${load.brokerName}`} {load.status}
                </div>
              </div>
            ))}
            {!loads.length && (
              <div className="text-center py-20 opacity-50">
                No loads available. Check back soon!
              </div>
            )}
          </div>

          {/* GPS Map */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6">🗺️ GPS Load Map</h2>
            <Map
              google={google}
              zoom={4}
              style={mapStyles}
              initialCenter={{ lat: 39.8283, lng: -98.5795 }} // US center
              containerStyle={{ width: '100%', height: '500px' }}
            >
              {loads.map(load => load.lat && load.lng && (
                <Marker
                  key={load.id}
                  position={{ lat: load.lat, lng: load.lng }}
                  title={`${load.origin} → ${load.destination}`}
                />
              ))}
              {selectedLoad?.lat && selectedLoad?.lng && (
                <InfoWindow
                  position={{ lat: selectedLoad.lat, lng: selectedLoad.lng }}
                  onCloseClick={() => setSelectedLoad(null)}
                >
                  <div className="p-4">
                    <h3>{selectedLoad.origin} → {selectedLoad.destination}</h3>
                    <p>Miles: {selectedLoad.miles?.toFixed(0)} | Rate: ${selectedLoad.rate}</p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>
        </div>
      </div>
    </div>
  )
}

Loads.getInitialProps = async () => {
  return { }
}

export { Loads }

