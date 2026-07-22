import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.category.create({
    data: {
      name: 'SmartHome',
      slug: 'smarthome',
      description: 'Smart home appliances and devices',
      displayOrder: 13,
      isActive: true
    }
  })
  console.log('SmartHome category added successfully')
  await prisma.$disconnect()
}

main().catch(console.error)