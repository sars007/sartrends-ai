import { Server } from 'socket.io'

let io

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end()
    return
  }

  const server = res.socket.server
  io = new Server(server, {
    cors: { origin: '*' }
  })

  res.socket.server.io = io

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('driver-location', (data) => {
      socket.broadcast.emit('live-location', data) // Broadcast to all
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  res.end()
}

