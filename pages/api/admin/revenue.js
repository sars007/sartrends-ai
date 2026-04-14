import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const admin = verifyToken(token)

  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const subs = await prisma.subscription.findMany({
    where: { active: true }
  })

  const prices = {
    "Resume AI": 30,
    "HSE AI": 100,
    "Ads 2D": 75,
    "Ads 3D": 200,
    "Full Access": 200,
    "Dispatcher Course": 50
  }

  let total = 0

  for (const s of subs) {
    total += prices[s.plan] || 0
  }

  res.json({ total })
}