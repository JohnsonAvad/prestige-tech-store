import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// ── VALIDATION SCHEMAS ──────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  referralCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// ── HELPER: Generate Tokens ──────────────────────────────
const generateTokens = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '90d' }
  );

  return { token, refreshToken };
};

// ── ROUTE: POST /api/auth/register ──────────────────────
router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const data = registerSchema.parse(req.body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingEmail) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    if (existingPhone) {
      return res.status(409).json({
        error: 'An account with this phone number already exists.'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Handle referral
    let referredById = null;
    if (data.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode }
      });
      if (referrer) referredById = referrer.id;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        referredById
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        loyaltyPoints: true,
        tier: true,
        referralCode: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { token, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'Account created successfully. Welcome to Prestige TechStore!',
      token,
      refreshToken,
      user
    });

  } catch (error) {
    next(error);
  }
});

// ── ROUTE: POST /api/auth/login ─────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const data = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // Check account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user.id);

    res.json({
      message: 'Login successful. Welcome back!',
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier,
        referralCode: user.referralCode
      }
    });

  } catch (error) {
    next(error);
  }
});

// ── ROUTE: POST /api/auth/refresh ───────────────────────
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required.'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid refresh token.'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    res.json({
      message: 'Token refreshed successfully.',
      ...tokens,
      user
    });

  } catch (error) {
    next(error);
  }
});

// ── ROUTE: GET /api/auth/me ─────────────────────────────
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        loyaltyPoints: true,
        tier: true,
        referralCode: true,
        birthday: true,
        whatsappNumber: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlistItems: true
          }
        }
      }
    });

    res.json({ user });

  } catch (error) {
    next(error);
  }
});

// ── ROUTE: POST /api/auth/logout ────────────────────────
router.post('/logout', authenticate, (req, res) => {
  // JWT is stateless — client deletes the token
  // In future we can maintain a token blacklist here
  res.json({
    message: 'Logged out successfully.'
  });
});

// ── ROUTE: PUT /api/auth/change-password ────────────────
router.put('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(422).json({
        error: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(422).json({
        error: 'New password must be at least 8 characters.'
      });
    }

    // Get full user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Current password is incorrect.'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    res.json({
      message: 'Password changed successfully.'
    });

  } catch (error) {
    next(error);
  }
});

export default router;