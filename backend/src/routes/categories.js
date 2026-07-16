import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = express.Router()
const prisma = new PrismaClient()

// ── GET ALL CATEGORIES ──
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    res.json({ categories })

  } catch (error) {
    next(error)
  }
})

// ── GET SINGLE CATEGORY ──
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }

    res.json({ category })

  } catch (error) {
    next(error)
  }
})

// ── CREATE CATEGORY (Admin only) ──
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { name, description, iconUrl, bannerUrl, displayOrder } = req.body

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await prisma.category.create({
      data: { name, slug, description, iconUrl, bannerUrl, displayOrder }
    })

    res.status(201).json({ message: 'Category created.', category })

  } catch (error) {
    next(error)
  }
})

// ── UPDATE CATEGORY (Admin only) ──
router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await prisma.category.update({
      where: { id },
      data: req.body
    })
    res.json({ message: 'Category updated.', category })
  } catch (error) {
    next(error)
  }
})

export default router