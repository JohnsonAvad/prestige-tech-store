import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'
import { z } from 'zod'

const router = express.Router()
const prisma = new PrismaClient()

// ── GET ALL PRODUCTS (with filters, sort, pagination) ──
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 24,
      search,
      isFeatured,
      isNewArrival,
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build where clause
   const where = {
  isPublished: true,
  ...(isFeatured === 'true' && { isFeatured: true }),
  ...(isNewArrival === 'true' && { isNewArrival: true }),
  ...(brand && { brand }),
  ...((minPrice || maxPrice) && {
    price: {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    }
  }),
  ...(search && {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }),
  ...(category && {
    category: {
      slug: category
    }
  }),
}

    // Build orderBy
    const orderBy = {
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      rating: { averageRating: 'desc' },
      popular: { totalSold: 'desc' },
    }[sort] || { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    res.json({
      products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    })

  } catch (error) {
    next(error)
  }
})

// ── GET SINGLE PRODUCT ──
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        isPublished: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    res.json({ product })

  } catch (error) {
    next(error)
  }
})

// ── CREATE PRODUCT (Admin only) ──
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
   const data = {
  name: req.body.name || 'Unnamed Product',
  brand: req.body.brand || 'Unknown',
  categoryId: req.body.categoryId,
  sku: req.body.sku || `SKU-${Date.now()}`,
  price: parseFloat(req.body.price) || 0,
  comparePrice: req.body.comparePrice ? parseFloat(req.body.comparePrice) : undefined,
  description: req.body.description || '',
  specs: req.body.specs || {},
  stock: parseInt(req.body.stock) || 10,
  images: req.body.images || [],
  isFeatured: req.body.isFeatured || false,
  isNewArrival: req.body.isNewArrival || false,
  tags: req.body.tags || [],
}

   
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now()

    const product = await prisma.product.create({
      data: { ...data, slug },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    })

    res.status(201).json({ message: 'Product created successfully.', product })

  } catch (error) {
    next(error)
  }
})

// ── UPDATE PRODUCT (Admin only) ──
router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    })

    res.json({ message: 'Product updated successfully.', product })

  } catch (error) {
    next(error)
  }
})

// ── DELETE PRODUCT (Admin only) ──
router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.product.update({
      where: { id },
      data: { isPublished: false }
    })

    res.json({ message: 'Product removed successfully.' })

  } catch (error) {
    next(error)
  }
})

// ── TOGGLE FEATURED (Admin only) ──
router.patch('/:id/featured', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({ where: { id } })
    const updated = await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured }
    })
    res.json({ message: 'Product updated.', product: updated })
  } catch (error) {
    next(error)
  }
})

export default router