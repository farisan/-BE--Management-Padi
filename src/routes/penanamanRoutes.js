const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const {
  createPenanaman,
  getAllPenanaman,
  getPenanamanById,
  updatePenanaman,
  deletePenanaman
} = require('../controllers/penanamanController');

/**
 * @swagger
 * tags:
 *   name: Penanaman
 *   description: API Manajemen Penanaman Padi
 */

// Semua rute di bawah ini butuh token
router.use(authMiddleware);

/**
 * @swagger
 * /api/penanaman:
 *   post:
 *     summary: Tambah data penanaman (Hanya Petani)
 *     tags: [Penanaman]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tanggalTebar
 *               - estimasiPanen
 *               - luasLahan
 *               - jenisPadi
 *               - status
 *             properties:
 *               tanggalTebar:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-01"
 *               estimasiPanen:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               luasLahan:
 *                 type: number
 *                 example: 2.5
 *               jenisPadi:
 *                 type: string
 *                 example: "Rojolele"
 *               status:
 *                 type: string
 *                 example: "proses"
 *     responses:
 *       201:
 *         description: Berhasil menambahkan data penanaman
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post('/', roleMiddleware(['petani']), createPenanaman);

/**
 * @swagger
 * /api/penanaman:
 *   get:
 *     summary: Ambil semua data penanaman
 *     tags: [Penanaman]
 *     parameters:
 *       - in: query
 *         name: jenisPadi
 *         schema:
 *           type: string
 *         description: Filter berdasarkan jenis padi
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter berdasarkan status (proses/panen)
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar penanaman
 */
router.get('/', getAllPenanaman);

/**
 * @swagger
 * /api/penanaman/{id}:
 *   get:
 *     summary: Ambil detail data penanaman berdasarkan ID
 *     tags: [Penanaman]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail
 *       404:
 *         description: Data tidak ditemukan
 */
router.get('/:id', getPenanamanById);

/**
 * @swagger
 * /api/penanaman/{id}:
 *   put:
 *     summary: Update data penanaman (Petani & Admin)
 *     tags: [Penanaman]
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
 *             properties:
 *               tanggalTebar:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-10"
 *               estimasiPanen:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-10"
 *               luasLahan:
 *                 type: number
 *                 example: 3.0
 *               jenisPadi:
 *                 type: string
 *                 example: "Ciherang"
 *               status:
 *                 type: string
 *                 example: "panen"
 *     responses:
 *       200:
 *         description: Berhasil mengupdate data
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 */
router.put('/:id', roleMiddleware(['admin', 'petani']), updatePenanaman);

/**
 * @swagger
 * /api/penanaman/{id}:
 *   delete:
 *     summary: Hapus data penanaman (Petani & Admin)
 *     tags: [Penanaman]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menghapus data
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 */
router.delete('/:id', roleMiddleware(['admin', 'petani']), deletePenanaman);

module.exports = router;
