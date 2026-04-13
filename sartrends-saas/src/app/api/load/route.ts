import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const loads = await prisma.load.findMany({
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ loads })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const load = await prisma.load.create({
      data: {
        ...data,
        userId: payload.sub
      }
    })

    return NextResponse.json({ load }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create load' }, { status: 500 })
  }
}

