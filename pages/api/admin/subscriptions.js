// prisma imported via auth guard above

import { verifyToken } from '../../../lib/auth.js'

export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

