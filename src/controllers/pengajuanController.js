const pengajuanService = require('../services/pengajuanService');

const createPengajuan = async (req, res) => {
  try {
    const data = await pengajuanService.createPengajuan(req.body, req.user.id);
    res.status(201).json({
      message: 'Pengajuan penjualan berhasil dibuat',
      data,
    });
  } catch (error) {
    if (error.message === 'Semua field harus diisi') return res.status(400).json({ message: error.message });
    console.error('Error createPengajuan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const getAllPengajuan = async (req, res) => {
  try {
    const data = await pengajuanService.getAllPengajuan(req.user.role, req.user.id);
    res.status(200).json({
      message: 'Berhasil mengambil daftar pengajuan',
      data,
    });
  } catch (error) {
    console.error('Error getAllPengajuan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const lihatPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pengajuanService.updateStatusDilihat(id, req.user.id);
    res.status(200).json({
      message: 'Status pengajuan menjadi dilihat',
      data,
    });
  } catch (error) {
    if (error.message === 'Pengajuan tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak') return res.status(403).json({ message: error.message });
    if (error.message === 'Hanya pengajuan pending yang bisa diubah menjadi dilihat') return res.status(400).json({ message: error.message });
    console.error('Error lihatPengajuan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const responPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pengajuanService.responPengajuan(id, req.user.id, req.body);
    res.status(200).json({
      message: 'Berhasil memberikan respon',
      data,
    });
  } catch (error) {
    if (error.message === 'Pengajuan tidak ditemukan') return res.status(404).json({ message: error.message });
    if (error.message === 'Akses ditolak') return res.status(403).json({ message: error.message });
    if (['Status respon tidak valid', 'Pengajuan ini sudah direspon sebelumnya'].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error responPengajuan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  createPengajuan,
  getAllPengajuan,
  lihatPengajuan,
  responPengajuan,
};
