const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json({
      message: 'Registrasi berhasil',
      data,
    });
  } catch (error) {
    if (['Email sudah terdaftar', 'Role tidak valid'].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error register:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.status(200).json({
      message: 'Login berhasil',
      token: data.token,
      data: data.user,
    });
  } catch (error) {
    if (['Email atau password salah', 'Akun Anda telah di-suspend'].includes(error.message)) {
      const statusCode = error.message === 'Akun Anda telah di-suspend' ? 403 : 401;
      return res.status(statusCode).json({ message: error.message });
    }
    console.error('Error login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const toggleSuspend = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspend } = req.body;
    const requestUserId = req.user.id;

    const data = await authService.toggleSuspendUser(id, requestUserId, suspend);
    res.status(200).json({
      message: suspend ? 'Akun berhasil di-suspend' : 'Akun berhasil di-unsuspend',
      data,
    });
  } catch (error) {
    if (['Status suspend harus berupa boolean', 'Tidak dapat men-suspend akun sendiri'].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'User tidak ditemukan') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error toggleSuspend:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  register,
  login,
  toggleSuspend,
};
