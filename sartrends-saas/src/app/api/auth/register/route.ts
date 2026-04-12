import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { generateToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, licenseNumber, truckNumber, mcNumber, dotNumber } = await request.json()

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        licenseNumber,
        truckNumber,
        mcNumber,
        dotNumber,
        ipAddress: request.ip || request.headers.get('x-forwarded-for'),
        deviceFingerprint: request.headers.get('user-agent') || 'unknown',
      }
    })

    const token = generateToken({ sub: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({ message: 'User created successfully', userId: user.id })
response.cookies.set('token', token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
