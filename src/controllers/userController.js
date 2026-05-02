const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllUsers(req.user.role, req.query.role);
    res.status(200).json({
      message: 'Berhasil mengambil daftar user',
      data,
    });
  } catch (error) {
    if (error.message.startsWith('Akses ditolak')) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Error getAllUsers:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestUserId = req.user.id;
    const requestUserRole = req.user.role;

    const data = await userService.updateUser(id, req.body, requestUserId, requestUserRole);
    res.status(200).json({
      message: 'Berhasil mengupdate data user',
      data,
    });
  } catch (error) {
    if (error.message === 'User tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak') return res.status(403).json({ message: error.message });
    
    console.error('Error updateUser:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};
