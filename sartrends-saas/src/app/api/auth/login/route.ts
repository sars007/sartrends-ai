import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !await verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Device lock check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    if (user.ipAddress && user.ipAddress !== ip) {
      return NextResponse.json({ error: 'Device/IP not authorized' }, { status: 401 })
    }

    if (user.deviceFingerprint && user.deviceFingerprint !== userAgent) {
      return NextResponse.json({ error: 'Device not authorized' }, { status: 401 })
    }

    // Update device info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ipAddress: ip,
        deviceFingerprint: userAgent,
      }
    })

    const token = generateToken({ sub: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({ message: 'Login successful', userId: user.id })
    response.cookies.set('token', token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
