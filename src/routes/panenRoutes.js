const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createPanen, getAllPanen } = require('../controllers/panenController');

/**
 * @swagger
 * tags:
 *   name: Panen
 *   description: API Manajemen Panen Padi
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/panen:
 *   post:
 *     summary: Tambah data panen (Petani)
 *     tags: [Panen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - penanamanId
 *               - tanggalPanen
 *               - jumlahPanen
 *               - kualitas
 *             properties:
 *               penanamanId:
 *                 type: string
 *                 example: "uuid-penanaman"
 *               tanggalPanen:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               jumlahPanen:
 *                 type: number
 *                 example: 5.5
 *               kualitas:
 *                 type: string
 *                 example: "Bagus"
 *     responses:
 *       201:
 *         description: Berhasil menambahkan data panen
 */
router.post('/', roleMiddleware(['petani']), createPanen);

/**
 * @swagger
 * /api/panen:
 *   get:
 *     summary: Ambil semua data panen
 *     tags: [Panen]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar panen
 */
router.get('/', getAllPanen);

module.exports = router;
