// Global error handler — catches all errors thrown anywhere in the app
// This must be the LAST middleware registered in index.js

export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this information already exists.',
      field: err.meta?.target
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Session expired. Please log in again.'
    });
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(422).json({
      error: 'Validation failed.',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong. Please try again.'
  });
};