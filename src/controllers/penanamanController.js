const penanamanService = require('../services/penanamanService');

const createPenanaman = async (req, res) => {
  try {
    const data = await penanamanService.createPenanaman(req.body, req.user.id);
    res.status(201).json({
      message: 'Data penanaman berhasil ditambahkan',
      data,
    });
  } catch (error) {
    if (error.message === 'Semua field harus diisi') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error createPenanaman:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const getAllPenanaman = async (req, res) => {
  try {
    const data = await penanamanService.getAllPenanaman(req.user.role, req.user.id, req.query);
    res.status(200).json({
      message: 'Berhasil mengambil data penanaman',
      data,
    });
  } catch (error) {
    console.error('Error getAllPenanaman:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const getPenanamanById = async (req, res) => {
  try {
    const data = await penanamanService.getPenanamanById(req.params.id, req.user.role, req.user.id);
    res.status(200).json({
      message: 'Berhasil mengambil data',
      data,
    });
  } catch (error) {
    if (error.message === 'Data penanaman tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak, ini bukan data Anda') return res.status(403).json({ message: error.message });
    console.error('Error getPenanamanById:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const updatePenanaman = async (req, res) => {
  try {
    const data = await penanamanService.updatePenanaman(req.params.id, req.body, req.user.role, req.user.id);
    res.status(200).json({
      message: 'Data penanaman berhasil diupdate',
      data,
    });
  } catch (error) {
    if (error.message === 'Data penanaman tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak, ini bukan data Anda') return res.status(403).json({ message: error.message });
    console.error('Error updatePenanaman:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const deletePenanaman = async (req, res) => {
  try {
    await penanamanService.deletePenanaman(req.params.id, req.user.role, req.user.id);
    res.status(200).json({
      message: 'Data penanaman berhasil dihapus',
    });
  } catch (error) {
    if (error.message === 'Data penanaman tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak, ini bukan data Anda') return res.status(403).json({ message: error.message });
    console.error('Error deletePenanaman:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  createPenanaman,
  getAllPenanaman,
  getPenanamanById,
  updatePenanaman,
  deletePenanaman,
};
