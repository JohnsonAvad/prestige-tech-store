import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.create({
    data: {
      name: 'Speakers',
      slug: 'speakers',
      description: 'Bluetooth speakers portable speakers and home audio',
      displayOrder: 14,
      isActive: true
    }
  })
  console.log('Speakers category added successfully:', category.name)
  await prisma.$disconnect()
}

main().catch(console.error)