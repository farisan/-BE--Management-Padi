const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ambil token dari header
  const token = req.header('Authorization');

  // Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
  }

  try {
    // Verifikasi token (Bearer <token>)
    const tokenPart = token.split(' ')[1] || token;
    const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET || 'secret_key_padi_app');
    
    // Set user dari payload token ke request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak, anda tidak memiliki izin' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
