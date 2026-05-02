const transaksiService = require('../services/transaksiService');

const getAllTransaksi = async (req, res) => {
  try {
    const data = await transaksiService.getAllTransaksi(req.user.role, req.user.id);
    res.status(200).json({
      message: 'Berhasil mengambil daftar transaksi penjualan',
      data,
    });
  } catch (error) {
    console.error('Error getAllTransaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  getAllTransaksi,
};
