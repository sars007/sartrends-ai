import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.split(' ')[1]
  const user = verifyToken(token)

  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const filePath = path.join(process.cwd(), 'public/uploads', Date.now() + '.png')

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  fs.writeFileSync(filePath, Buffer.concat(chunks))

  await prisma.payment.create({
    data: {
      userId: user.userId,
      proofImage: filePath,
      status: 'pending'
    }
  })

  res.json({ success: true })
}

