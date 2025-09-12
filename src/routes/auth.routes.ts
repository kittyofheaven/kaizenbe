import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - nomorWa
 *         - password
 *       properties:
 *         nomorWa:
 *           type: string
 *           description: WhatsApp number
 *           example: "+6281234567890"
 *         password:
 *           type: string
 *           description: User password
 *           example: "password123"
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - namaLengkap
 *         - namaPanggilan
 *         - nomorWa
 *         - password
 *       properties:
 *         idAngkatan:
 *           type: string
 *           format: int64
 *           description: Angkatan ID (optional)
 *           example: "1"
 *         namaLengkap:
 *           type: string
 *           description: Full name
 *           example: "John Doe"
 *         namaPanggilan:
 *           type: string
 *           description: Nickname
 *           example: "John"
 *         nomorWa:
 *           type: string
 *           description: WhatsApp number
 *           example: "+6281234567890"
 *         password:
 *           type: string
 *           description: User password (min 6 characters)
 *           example: "password123"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT access token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             expiresIn:
 *               type: string
 *               description: Token expiration time
 *               example: "1h"
 *         message:
 *           type: string
 *           example: "Login berhasil"
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Current password
 *           example: "oldpassword123"
 *         newPassword:
 *           type: string
 *           description: New password (min 6 characters)
 *           example: "newpassword123"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             example1:
 *               summary: Standard login
 *               value:
 *                 nomorWa: "+6281234567890"
 *                 password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nomor WhatsApp atau password tidak valid"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", authController.login);

// TEMPORARILY DISABLED - Registration endpoint
// Uncomment the lines below to enable registration
/*
router.post("/register", authController.register);
*/

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Profile berhasil diambil"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access token is required"
 */
router.get("/profile", AuthMiddleware.authenticate, authController.getProfile);

/**
 * @swagger
 * /api/v1/auth/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Password berhasil diupdate"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Password lama tidak valid"
 *                     - "Password baru minimal 6 karakter"
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/update-password",
  AuthMiddleware.authenticate,
  authController.updatePassword
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Logout berhasil"
 */
router.post("/logout", AuthMiddleware.authenticate, authController.logout);

export default router;
