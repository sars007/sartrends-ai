import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req, res) {
  try {
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

    // ✅ FIXED DATE LOGIC (NO createdAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekly = new Date()
    weekly.setDate(weekly.getDate() - 7)

    const dailySubs = await prisma.subscription.count({
      where: {
        startDate: { gte: today }
      }
    })

    const weeklySubs = await prisma.subscription.count({
      where: {
        startDate: { gte: weekly }
      }
    })

    const activeUsers = await prisma.subscription.count({
      where: { active: true }
    })

    const dailyRevenue = dailySubs * 50

    const alert =
      total < 1000
        ? '⚠️ Low revenue - check campaigns'
        : '✅ Healthy'

    res.json({
      total,
      dailyRevenue,
      weeklySubs,
      activeUsers,
      alert
    })
  } catch (err) {
    console.error('REVENUE ERROR:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
