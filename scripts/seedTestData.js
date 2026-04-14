const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Test user
  const testEmail = 'test@trucking.com'
  const testPassword = await bcrypt.hash('test123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: testEmail },
    update: { password: testPassword },
    create: {
      email: testEmail,
      password: testPassword,
      role: 'user'
    }
  })

  // Test payment for test user
  const testPayment = await prisma.payment.upsert({
    where: { id: 'test-payment-1' },
    update: { status: 'approved' },
    create: {
      id: 'test-payment-1',
      userId: testUser.id,
      proofImage: '/uploads/test.png',
      status: 'approved'
    }
  })

  // Test sub
  await prisma.subscription.upsert({
    where: { id: 'test-sub-1' },
    update: {},
    create: {
      id: 'test-sub-1',
      userId: testUser.id,
      plan: 'resume-ai',
      active: true
    }
  })

  console.log('✅ Test data seeded: test@trucking.com / test123')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

