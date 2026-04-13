import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    const hashedPassword = await hashPassword(password)

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ipAddress: ip,
        deviceFingerprint: userAgent,
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
