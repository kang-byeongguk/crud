import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`User with email ${email} already exists.`)
  } else {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: 'Admin User',
        password: hashedPassword,
      },
    })
    console.log(`Created user with id: ${user.id}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
