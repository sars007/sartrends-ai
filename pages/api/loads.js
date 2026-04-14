import { prisma } from '../../lib/prisma.js'
import { verifyToken } from '../../lib/auth.js'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const loads = await prisma.load.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      })
      res.json(loads)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch loads' })
    }
  } else if (req.method === 'POST') {
    try {
      const { brokerName, origin, destination, miles, rate } = req.body
      const ratePerMile = miles ? (rate / miles).toFixed(2) : 0

      const load = await prisma.load.create({
        data: {
          brokerName,
          origin,
          destination,
          miles,
          rate,
          ratePerMile: parseFloat(ratePerMile),
          status: 'open'
        }
      })
      res.json(load)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create load' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

