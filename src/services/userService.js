const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const getAllUsers = async (requestUserRole, queryRole) => {
  // Hanya admin yang bisa mengambil seluruh data tanpa filter role
  // Jika bukan admin dan tidak memfilter role tertentu, tolak akses
  if (requestUserRole !== 'admin' && !queryRole) {
    throw new Error('Akses ditolak. Silakan tentukan spesifik role yang dicari.');
  }

  const queryWhere = {};
  if (queryRole) {
    queryWhere.role = queryRole;
  }

  return await prisma.pengguna.findMany({
    where: queryWhere,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      isSuspended: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateUser = async (id, data, requestUserId, requestUserRole) => {
  const existingUser = await prisma.pengguna.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error('User tidak ditemukan');
  }

  // Hanya admin atau user yang bersangkutan yang bisa mengedit
  if (requestUserRole !== 'admin' && requestUserId !== id) {
    throw new Error('Akses ditolak');
  }

  const { name, email, role, address, password } = data;
  let hashedPassword = existingUser.password;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  return await prisma.pengguna.update({
    where: { id },
    data: {
      name: name || undefined,
      email: email || undefined,
      role: role && requestUserRole === 'admin' ? role : undefined, // hanya admin yang bisa ganti role
      address: address || undefined,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      isSuspended: true,
    },
  });
};

module.exports = {
  getAllUsers,
  updateUser,
};
