import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// ── CREATE ORDER ──
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      items,
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      deliveryArea,
      deliveryFee,
      paymentMethod,
      notes,
    } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order.' })
    }

    // Calculate total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const total = subtotal + (deliveryFee || 0)

    // Generate order number
    const orderNumber = `PTS-${Date.now().toString().slice(-8)}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
        subtotal,
        deliveryFee: deliveryFee || 0,
        total,
        deliveryName,
        deliveryPhone,
        deliveryAddress,
        deliveryArea,
        notes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }))
        }
      },
      include: {
        items: true
      }
    })

    res.status(201).json({ message: 'Order created successfully.', order })

  } catch (error) {
    next(error)
  }
})

// ── GET USER ORDERS ──
router.get('/my-orders', authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ orders })
  } catch (error) {
    next(error)
  }
})

// ── GET SINGLE ORDER ──
router.get('/:orderNumber', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: req.params.orderNumber,
        userId: req.user.id
      },
      include: { items: true }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    res.json({ order })
  } catch (error) {
    next(error)
  }
})

// ── GET ALL ORDERS (Admin) ──
router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: { id: true, name: true, phone: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ orders })
  } catch (error) {
    next(error)
  }
})

// ── UPDATE ORDER STATUS (Admin) ──
router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    })
    res.json({ message: 'Order status updated.', order })
  } catch (error) {
    next(error)
  }
})

export default router