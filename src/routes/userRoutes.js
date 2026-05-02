const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { getAllUsers, updateUser } = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API Manajemen User
 */

// Semua route butuh token
router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Ambil daftar seluruh pengguna
 *     description: Admin bisa melihat semua. User lain hanya bisa melihat jika memfilter spesifik role (misal petani mencari tengkulak)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, petani, tengkulak]
 *         description: Filter data user berdasarkan role
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *       403:
 *         description: Akses ditolak
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Edit data pengguna
 *     description: Admin dapat mengedit data siapa saja. User biasa hanya dapat mengedit datanya sendiri.
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *                 example: Budi Petani Maju
 *               email:
 *                 type: string
 *                 example: budimaju@gmail.com
 *               role:
 *                 type: string
 *                 description: Hanya bisa diubah oleh admin
 *                 enum: [admin, petani, tengkulak]
 *                 example: petani
 *               address:
 *                 type: string
 *                 example: Jl. Sawah No 99, Subang
 *               password:
 *                 type: string
 *                 example: passwordbaru123
 *     responses:
 *       200:
 *         description: Berhasil mengupdate data
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: User tidak ditemukan
 */
router.put('/:id', updateUser);

module.exports = router;
