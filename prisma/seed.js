const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('Aliraza00721@', 10)

  // ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'info@sartrends.store' },
    update: {},
    create: {
      email: 'info@sartrends.store',
      password,
      role: 'admin'
    }
  })

  // TEST USER
  const user = await prisma.user.upsert({
    where: { email: 'test@trucking.com' },
    update: {},
    create: {
      email: 'test@trucking.com',
      password,
      role: 'user'
    }
  })

  // SUBSCRIPTION
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'Full Access',
      active: true,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })

  // PAYMENT
  await prisma.payment.create({
    data: {
      userId: user.id,
      proofImage: 'test.png',
      status: 'approved'
    }
  })

  console.log('✅ Seed completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })