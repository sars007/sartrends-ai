import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
  if (decoded.userId !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { subscriptions: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
