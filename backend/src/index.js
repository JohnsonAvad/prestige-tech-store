import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' }
})
app.use('/api', limiter)

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Prestige TechStore API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  })
})

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║   Prestige TechStore API               ║
  ║   Running on port ${PORT}                 ║
  ║   Environment: ${process.env.NODE_ENV}        ║
  ╚════════════════════════════════════════╝
    `)
  })
}

export default app