import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { authenticate } from '../middleware/auth.js'
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed'))
    }
  }
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.post('/', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' })
    }

    const fileExt = req.file.originalname.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `products/${fileName}`

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    res.json({
      message: 'Image uploaded successfully.',
      url: urlData.publicUrl,
      path: filePath
    })

  } catch (error) {
    next(error)
  }
})

export default router