// Must be used AFTER authenticate middleware
// Blocks anyone who is not an ADMIN or SUPPORT role

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required.'
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPPORT') {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Strict admin only — support agents cannot access
export const strictAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required.'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied. Only store administrators can access this.'
    });
  }

  next();
};