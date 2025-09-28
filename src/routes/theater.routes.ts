import { Router } from "express";
import { TheaterController } from "../controllers/theater.controller";

const router = Router();
const theaterController = new TheaterController();

/**
 * @swagger
 * tags:
 *   name: Theater
 *   description: Theater / auditorium booking management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           example: "1"
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           example: "2"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T14:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           example: "10"
 *         keterangan:
 *           type: string
 *           nullable: true
 *           example: "Gladi bersih acara kampus"
 *         isDone:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         penanggungJawab:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: int64
 *             namaLengkap:
 *               type: string
 *             namaPanggilan:
 *               type: string
 *             nomorWa:
 *               type: string
 *               nullable: true
 *     CreateTheaterRequest:
 *       type: object
 *       required:
 *         - idPenanggungJawab
 *         - waktuMulai
 *         - waktuBerakhir
 *         - jumlahPengguna
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           example: "2"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           example: "2025-09-20T14:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           example: "10"
 *         keterangan:
 *           type: string
 *           nullable: true
 *           example: "Briefing acara"
 *         isDone:
 *           type: boolean
 *           example: false
 *     UpdateTheaterRequest:
 *       type: object
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *         keterangan:
 *           type: string
 *           nullable: true
 *         isDone:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/theater:
 *   get:
 *     summary: Get all theater bookings
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Theater bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", theaterController.getAll);

/**
 * @swagger
 * /api/v1/theater/penanggung-jawab/{penanggungJawabId}:
 *   get:
 *     summary: Get theater bookings by penanggung jawab
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: penanggungJawabId
 *         in: path
 *         required: true
 *         description: Penanggung jawab ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Theater bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Theater'
 *                 message:
 *                   type: string
 *                   example: Data theater berhasil diambil
 */
router.get(
  "/penanggung-jawab/:penanggungJawabId",
  theaterController.getTheaterByPenanggungJawab
);

/**
 * @swagger
 * /api/v1/theater/time-slots:
 *   get:
 *     summary: Get available theater time slots for a specific date
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       waktuMulai:
 *                         type: string
 *                         format: date-time
 *                       waktuBerakhir:
 *                         type: string
 *                         format: date-time
 *                       display:
 *                         type: string
 *                         example: "13:00 - 14:00"
 *                       available:
 *                         type: boolean
 *                         example: true
 *                 message:
 *                   type: string
 *                   example: Slot waktu tersedia berhasil diambil
 */
router.get("/time-slots", theaterController.getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/theater/time-suggestions:
 *   get:
 *     summary: Get theater time slot suggestions (1-hour slots)
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: query
 *         required: false
 *         description: 'Date in YYYY-MM-DD format (default today)'
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Time slot suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       waktuMulai:
 *                         type: string
 *                         format: date-time
 *                       waktuBerakhir:
 *                         type: string
 *                         format: date-time
 *                       display:
 *                         type: string
 *                         example: "13:00 - 14:00"
 *                 message:
 *                   type: string
 *                   example: Saran slot waktu berhasil diambil
 */
router.get("/time-suggestions", theaterController.getTimeSlotSuggestions);

/**
 * @swagger
 * /api/v1/theater/{id}:
 *   get:
 *     summary: Get theater booking by ID
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Theater booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Theater booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
 */
router.get("/:id", theaterController.getById);

/**
 * @swagger
 * /api/v1/theater:
 *   post:
 *     summary: Create new theater booking
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTheaterRequest'
 *     responses:
 *       200:
 *         description: Theater booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
 *                 message:
 *                   type: string
 *                   example: Booking theater berhasil dibuat
 */
router.post("/", theaterController.create);

/**
 * @swagger
 * /api/v1/theater/{id}:
 *   put:
 *     summary: Update theater booking
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Theater booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTheaterRequest'
 *     responses:
 *       200:
 *         description: Theater booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
 *                 message:
 *                   type: string
 *                   example: Booking theater berhasil diupdate
 */
router.put("/:id", theaterController.update);

/**
 * @swagger
 * /api/v1/theater/{id}:
 *   delete:
 *     summary: Delete theater booking
 *     tags: [Theater]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Theater booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Theater booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   nullable: true
 *                 message:
 *                   type: string
 *                   example: Resource deleted successfully
 */
router.delete("/:id", theaterController.delete);

export default router;
