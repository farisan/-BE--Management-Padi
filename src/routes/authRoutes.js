const express = require('express');
const router = express.Router();
const { register, login, toggleSuspend } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Petani
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, petani, tengkulak]
 *                 example: petani
 *               address:
 *                 type: string
 *                 example: Jl. Sawah No 1, Subang
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 *       400:
 *         description: Bad request
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Akun di-suspend
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/suspend/{id}:
 *   post:
 *     summary: Suspend or unsuspend user (Admin only)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "e2c3b4a5-6789-4b12-9c3d-1a2b3c4d5e6f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - suspend
 *             properties:
 *               suspend:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status berhasil diubah
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post('/suspend/:id', authMiddleware, roleMiddleware(['admin']), toggleSuspend);

module.exports = router;
