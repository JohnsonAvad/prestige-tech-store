import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 1. Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 2. Configure Multer (Strict 4MB limit to stay under Vercel's 4.5MB total limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 } 
});

// 3. The Route
// Note: Ensure 'authenticate' is working correctly; if in doubt, test without it first
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.error('Multer error: No file in request. Check if frontend key is "image"');
      return res.status(400).json({ error: 'No image file provided.' });
    }

    console.log('File detected:', req.file.originalname, 'Size:', req.file.size);

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // 4. Upload to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from('products') // DOUBLE CHECK: Is your bucket name exactly "products" (all lowercase)?
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError.message);
      return res.status(400).json({ error: uploadError.message });
    }

    // 5. Get Public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('Upload successful. URL:', urlData.publicUrl);

    return res.json({
      message: 'Image uploaded successfully.',
      url: urlData.publicUrl,
      path: filePath
    });

  } catch (error) {
    console.error('Global Upload Route Error:', error.message);
    return res.status(500).json({ error: 'Internal server error during upload.' });
  }
});

export default router;
