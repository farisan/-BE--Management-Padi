const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllTransaksi } = require('../controllers/transaksiController');

/**
 * @swagger
 * tags:
 *   name: Transaksi Penjualan
 *   description: API Laporan Transaksi Penjualan Padi
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/transaksi:
 *   get:
 *     summary: Lihat daftar transaksi / report penjualan (Admin, Petani, Tengkulak)
 *     description: Petani melihat transaksi miliknya, Tengkulak melihat transaksinya, Admin melihat semua.
 *     tags: [Transaksi Penjualan]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data transaksi
 */
router.get('/', getAllTransaksi);

module.exports = router;
