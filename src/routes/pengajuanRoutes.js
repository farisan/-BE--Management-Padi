const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createPengajuan, getAllPengajuan, lihatPengajuan, responPengajuan } = require('../controllers/pengajuanController');

/**
 * @swagger
 * tags:
 *   name: Pengajuan Penjualan
 *   description: API Manajemen Pengajuan dan Persetujuan Penjualan Padi
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/pengajuan:
 *   post:
 *     summary: Buat pengajuan penjualan (Hanya Petani)
 *     tags: [Pengajuan Penjualan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - panenId
 *               - tengkulakId
 *               - hargaTawaran
 *             properties:
 *               panenId:
 *                 type: string
 *                 example: "uuid-panen"
 *               tengkulakId:
 *                 type: string
 *                 example: "uuid-tengkulak"
 *               hargaTawaran:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Berhasil membuat pengajuan
 */
router.post('/', roleMiddleware(['petani']), createPengajuan);

/**
 * @swagger
 * /api/pengajuan:
 *   get:
 *     summary: Lihat daftar pengajuan (Petani & Tengkulak)
 *     tags: [Pengajuan Penjualan]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 */
router.get('/', getAllPengajuan);

/**
 * @swagger
 * /api/pengajuan/{id}/dilihat:
 *   put:
 *     summary: Tengkulak setuju melihat hasil padi (Update status ke dilihat)
 *     tags: [Pengajuan Penjualan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status menjadi dilihat
 */
router.put('/:id/dilihat', roleMiddleware(['tengkulak']), lihatPengajuan);

/**
 * @swagger
 * /api/pengajuan/{id}/respon:
 *   post:
 *     summary: Tengkulak menyetujui (deal) atau menolak pengajuan
 *     tags: [Pengajuan Penjualan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: "approve"
 *               catatan:
 *                 type: string
 *                 example: "Padi kualitas bagus, saya setuju"
 *               hargaDeal:
 *                 type: number
 *                 description: Diisi jika harga deal berbeda dengan tawaran awal (opsional)
 *                 example: 4800
 *     responses:
 *       200:
 *         description: Respon berhasil disimpan (Deal/Batal)
 */
router.post('/:id/respon', roleMiddleware(['tengkulak']), responPengajuan);

module.exports = router;
