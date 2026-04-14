import { prisma } from '../../../../../lib/prisma'
import { verifyToken } from '../../../../../lib/auth'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const admin = verifyToken(token)

  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  const payment = await prisma.payment.update({
    where: { id },
    data: { status: 'approved' }
  })

  const plan = "Resume AI"

  let expiry = new Date()
  expiry.setMonth(expiry.getMonth() + 1)

  await prisma.subscription.create({
    data: {
      userId: payment.userId,
      plan,
      expiryDate: expiry,
      active: true
    }
  })

  res.json({ success: true })
}
