import { prisma } from '../../../lib/prisma.js'
import { verifyToken } from '../../../lib/auth.js'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      const progress = await prisma.courseProgress.findMany({
        where: { userId: decoded.userId }
      })
      res.json(progress)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  } else if (req.method === 'POST') {
    const { course, lesson } = req.body
    try {
      const progress = await prisma.courseProgress.upsert({
        where: { userId_course: { userId: decoded.userId, course } },
        update: { lesson, completed: true, updatedAt: new Date() },
        create: {
          userId: decoded.userId,
          course,
          lesson,
          completed: true
        }
      })
      res.json(progress)
    } catch {
      res.status(500).json({ error: 'Failed' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

