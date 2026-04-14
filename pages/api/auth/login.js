import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "User not found" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Wrong password" })

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      token,
      role: user.role,
      userId: user.id
    })

  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: "Server error" })
  }
}
