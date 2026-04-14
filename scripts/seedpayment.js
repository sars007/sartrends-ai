const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()

  if (!user) {
    console.log("❌ No user found")
    return
  }

  // Create payment
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      proofImage: "test.png",
      status: "approved"
    }
  })

  // Create subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: "Resume AI",
      active: true
    }
  })

  console.log("✅ Payment + Subscription created")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })