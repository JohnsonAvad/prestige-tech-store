import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding sample products...')

  // Get categories
  const categories = await prisma.category.findMany()
  const laptopCat = categories.find(c => c.slug === 'laptops')
  const phoneCat = categories.find(c => c.slug === 'smartphones')
  const monitorCat = categories.find(c => c.slug === 'monitors')
  const tabletCat = categories.find(c => c.slug === 'tablets')
  const headphoneCat = categories.find(c => c.slug === 'headphones')

  const products = [
    {
      name: 'MacBook Pro 14 M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      brand: 'Apple',
      categoryId: laptopCat?.id,
      sku: 'APPL-MBP14-M3',
      price: 4500000,
      comparePrice: 5000000,
      description: 'The MacBook Pro 14 with M3 Pro chip delivers extraordinary performance for professionals. Features a stunning Liquid Retina XDR display, up to 18 hours of battery life and the most powerful chip ever in a Mac.',
      specs: {
        'Processor': 'Apple M3 Pro',
        'RAM': '18GB Unified Memory',
        'Storage': '512GB SSD',
        'Display': '14.2-inch Liquid Retina XDR',
        'Battery': 'Up to 18 hours',
        'Weight': '1.61 kg',
        'Ports': '3x Thunderbolt 4, HDMI, SD Card, MagSafe 3'
      },
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871525-1c0be4a2deba?w=800&q=80',
      ],
      isFeatured: true,
      isNewArrival: true,
      tags: ['laptop', 'apple', 'macbook', 'professional'],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      brand: 'Samsung',
      categoryId: phoneCat?.id,
      sku: 'SAMS-S24U-256',
      price: 3200000,
      comparePrice: 3500000,
      description: 'The Samsung Galaxy S24 Ultra is the ultimate Android smartphone. Features a 200MP camera, built-in S Pen, titanium frame and AI-powered features.',
      specs: {
        'Processor': 'Snapdragon 8 Gen 3',
        'RAM': '12GB',
        'Storage': '256GB',
        'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz',
        'Camera': '200MP Main + 10MP + 10MP + 12MP',
        'Battery': '5000mAh, 45W Fast Charging',
        'S Pen': 'Built-in'
      },
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      ],
      isFeatured: true,
      isNewArrival: false,
      tags: ['smartphone', 'samsung', 'android', 'camera'],
    },
    {
      name: 'Dell UltraSharp 27 4K Monitor',
      slug: 'dell-ultrasharp-27-4k-monitor',
      brand: 'Dell',
      categoryId: monitorCat?.id,
      sku: 'DELL-U2723DE',
      price: 1800000,
      comparePrice: 2000000,
      description: 'The Dell UltraSharp 27 4K USB-C Hub Monitor delivers stunning 4K resolution with exceptional color accuracy. Perfect for creative professionals and power users.',
      specs: {
        'Display Size': '27 inches',
        'Resolution': '3840 x 2160 (4K UHD)',
        'Panel Type': 'IPS Black',
        'Refresh Rate': '60Hz',
        'Color Coverage': '100% sRGB, 98% DCI-P3',
        'Connectivity': 'USB-C 90W, HDMI, DisplayPort, USB Hub',
        'Response Time': '5ms'
      },
      stock: 10,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80',
      ],
      isFeatured: true,
      isNewArrival: false,
      tags: ['monitor', 'dell', '4k', 'ultrasharp'],
    },
    {
      name: 'iPad Pro 12.9 M2',
      slug: 'ipad-pro-12-9-m2',
      brand: 'Apple',
      categoryId: tabletCat?.id,
      sku: 'APPL-IPADPRO-M2',
      price: 2800000,
      comparePrice: 3100000,
      description: 'The iPad Pro with M2 chip is the ultimate iPad experience. Features a stunning Liquid Retina XDR display, Apple Pencil support and all-day battery life.',
      specs: {
        'Chip': 'Apple M2',
        'Display': '12.9-inch Liquid Retina XDR',
        'Storage': '256GB',
        'Cameras': '12MP Wide + 10MP Ultra Wide',
        'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3',
        'Battery': 'Up to 10 hours',
        'Apple Pencil': 'Apple Pencil 2nd generation support'
      },
      stock: 8,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
      ],
      isFeatured: false,
      isNewArrival: true,
      tags: ['tablet', 'apple', 'ipad', 'pro'],
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5-headphones',
      brand: 'Sony',
      categoryId: headphoneCat?.id,
      sku: 'SONY-WH1000XM5',
      price: 850000,
      comparePrice: 950000,
      description: 'Industry-leading noise canceling headphones with exceptional sound quality. Features 30-hour battery life, multipoint connection and crystal clear hands-free calling.',
      specs: {
        'Driver': '30mm',
        'Frequency Response': '4Hz-40,000Hz',
        'Battery Life': '30 hours with NC on',
        'Charging': 'USB-C, 3 min charge = 3 hours playback',
        'Weight': '250g',
        'Noise Canceling': 'Industry-leading with 8 microphones',
        'Connectivity': 'Bluetooth 5.2, 3.5mm jack'
      },
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=800&q=80',
      ],
      isFeatured: true,
      isNewArrival: false,
      tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    },
    {
      name: 'HP EliteBook 840 G10',
      slug: 'hp-elitebook-840-g10',
      brand: 'HP',
      categoryId: laptopCat?.id,
      sku: 'HP-EB840-G10',
      price: 3800000,
      comparePrice: 4200000,
      description: 'The HP EliteBook 840 G10 is a premium business laptop built for professionals. Features Intel Core i7, military-grade durability and outstanding security features.',
      specs: {
        'Processor': 'Intel Core i7-1355U',
        'RAM': '16GB DDR5',
        'Storage': '512GB NVMe SSD',
        'Display': '14-inch IPS FHD Anti-glare',
        'Battery': 'Up to 12 hours',
        'Security': 'HP Wolf Security, Fingerprint, IR Camera',
        'Weight': '1.33 kg'
      },
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      ],
      isFeatured: false,
      isNewArrival: true,
      tags: ['laptop', 'hp', 'business', 'elitebook'],
    },
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      brand: 'Apple',
      categoryId: phoneCat?.id,
      sku: 'APPL-IP15PM-256',
      price: 4200000,
      comparePrice: 4500000,
      description: 'iPhone 15 Pro Max. Titanium. So strong. So light. So Pro. Features the A17 Pro chip, 48MP camera system with 5x optical zoom and USB 3 speeds.',
      specs: {
        'Chip': 'A17 Pro',
        'Display': '6.7-inch Super Retina XDR, 120Hz ProMotion',
        'Storage': '256GB',
        'Camera': '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
        'Battery': 'Up to 29 hours video playback',
        'Frame': 'Titanium',
        'Connector': 'USB-C with USB 3'
      },
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
      ],
      isFeatured: true,
      isNewArrival: true,
      tags: ['smartphone', 'apple', 'iphone', 'pro'],
    },
    {
      name: 'Anker PowerCore 26800mAh Power Bank',
      slug: 'anker-powercore-26800-power-bank',
      brand: 'Anker',
      categoryId: categories.find(c => c.slug === 'power-banks')?.id,
      sku: 'ANKR-PC26800',
      price: 180000,
      comparePrice: 220000,
      description: 'The Anker PowerCore 26800mAh is a high-capacity portable charger that can charge your devices multiple times. Features dual USB-A ports and USB-C input.',
      specs: {
        'Capacity': '26800mAh',
        'Input': 'Micro USB + USB-C 18W',
        'Output': '2x USB-A 5V/3A, 1x USB-C 5V/3A',
        'Charge Speed': '18W Fast Charging',
        'Dimensions': '165 x 60 x 22mm',
        'Weight': '480g',
        'Safety': 'MultiProtect safety system'
      },
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
      ],
      isFeatured: false,
      isNewArrival: false,
      tags: ['power-bank', 'anker', 'charging', 'portable'],
    },
  ]

  let created = 0
  for (const product of products) {
    if (!product.categoryId) continue
    try {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product
      })
      created++
      console.log(`✅ ${product.name}`)
    } catch (e) {
      console.log(`❌ ${product.name}: ${e.message}`)
    }
  }

  console.log(`\n✅ ${created} products added successfully!`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())