import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...')

  // ── DELETE EXISTING ADMIN IF EXISTS ──
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: process.env.ADMIN_EMAIL || 'admin@techstore.com' },
        { phone: '256700000000' },
        { phone: '256700000001' },
      ]
    }
  })

  // ── CREATE ADMIN USER ──
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'ChangeMe@2024!', 12
  )

  const admin = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || 'Store Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@techstore.com',
      phone: '256700000000',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // ── CREATE PRODUCT CATEGORIES ──
  const categories = [
    { name: 'Laptops', slug: 'laptops', description: 'HP, Dell, Lenovo, Apple MacBooks', displayOrder: 1 },
    { name: 'Smartphones', slug: 'smartphones', description: 'iPhones, Samsung, Tecno, Infinix', displayOrder: 2 },
    { name: 'Monitors', slug: 'monitors', description: '4K, Gaming, Ultrawide monitors', displayOrder: 3 },
    { name: 'Accessories', slug: 'accessories', description: 'Keyboards, mice, headsets, webcams', displayOrder: 4 },
    { name: 'Cameras', slug: 'cameras', description: 'DSLR, Mirrorless, Action cameras, Drones', displayOrder: 5 },
    { name: 'Tablets', slug: 'tablets', description: 'iPad, Samsung Galaxy Tab, Lenovo', displayOrder: 6 },
    { name: 'Networking', slug: 'networking', description: 'Routers, switches, network cables', displayOrder: 7 },
    { name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, Flash drives, Memory cards', displayOrder: 8 },
    { name: 'Power', slug: 'power', description: 'Power banks, UPS, Solar chargers', displayOrder: 9 },
    { name: 'Gaming', slug: 'gaming', description: 'Gaming mice, keyboards, headsets, controllers', displayOrder: 10 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Product categories created:', categories.length)

  // ── CREATE TEST CUSTOMER ──
  await prisma.user.deleteMany({
    where: { email: 'customer@test.com' }
  })

  const customerPassword = await bcrypt.hash('TestCustomer@2024!', 12)

  const customer = await prisma.user.create({
    data: {
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '256700000001',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      loyaltyPoints: 500,
      tier: 'BRONZE'
    }
  })

  console.log('✅ Test customer created:', customer.email)
  console.log('')
  console.log('═══════════════════════════════════════')
  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('Admin Login:')
  console.log('  Email:   ', process.env.ADMIN_EMAIL || 'admin@techstore.com')
  console.log('  Password: ChangeMe@2024!')
  console.log('═══════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })