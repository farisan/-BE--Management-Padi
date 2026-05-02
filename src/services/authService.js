const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (data) => {
  const { name, email, password, role, address } = data;

  const existingUser = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const validRoles = ['admin', 'petani', 'tengkulak'];
  if (!validRoles.includes(role)) {
    throw new Error('Role tidak valid');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.pengguna.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      address,
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

const loginUser = async (email, password) => {
  const user = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Email atau password salah');
  }

  if (user.isSuspended) {
    throw new Error('Akun Anda telah di-suspend');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret_key_padi_app',
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const toggleSuspendUser = async (targetId, requestUserId, suspendStatus) => {
  if (typeof suspendStatus !== 'boolean') {
    throw new Error('Status suspend harus berupa boolean');
  }

  const user = await prisma.pengguna.findUnique({ where: { id: targetId } });
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.id === requestUserId) {
    throw new Error('Tidak dapat men-suspend akun sendiri');
  }

  const updatedUser = await prisma.pengguna.update({
    where: { id: targetId },
    data: { isSuspended: suspendStatus },
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    isSuspended: updatedUser.isSuspended,
  };
};

module.exports = {
  registerUser,
  loginUser,
  toggleSuspendUser,
};
