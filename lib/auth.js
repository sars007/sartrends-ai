import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret123'

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

import { prisma } from './prisma.js'

export async function getActiveSubscription(userId, role) {
  // Admin bypass - unlimited access
  if (role === 'admin') return { plan: 'full', active: true }
  
  try {
    const now = new Date()
    const sub = await prisma.subscription.findFirst({
      where: {
        userId,
        active: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gt: now } }
        ]
      }
    })
    return sub
  } catch {
    return null
  }
}

