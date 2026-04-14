const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = "info@sartrends.store"
  const password = await bcrypt.hash("Aliraza00721@", 10)

  await prisma.user.upsert({
    where: { email },
    update: {
      password,
      role: "admin"
    },
    create: {
      email,
      password,
      role: "admin"
    }
  })

  console.log("✅ Admin READY (FORCED)")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
