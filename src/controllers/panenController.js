const panenService = require('../services/panenService');

const createPanen = async (req, res) => {
  try {
    const data = await panenService.createPanen(req.body);
    res.status(201).json({
      message: 'Data panen berhasil ditambahkan',
      data,
    });
  } catch (error) {
    if (error.message === 'Semua field harus diisi') return res.status(400).json({ message: error.message });
    console.error('Error createPanen:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const getAllPanen = async (req, res) => {
  try {
    const data = await panenService.getAllPanen(req.user.role, req.user.id);
    res.status(200).json({
      message: 'Berhasil mengambil data panen',
      data,
    });
  } catch (error) {
    console.error('Error getAllPanen:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  createPanen,
  getAllPanen,
};
