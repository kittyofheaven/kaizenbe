import { Router } from "express";
import { CWSController } from "../controllers/cws.controller";

const router = Router();
const cwsController = new CWSController();

/**
 * @swagger
 * tags:
 *   name: CWS
 *   description: CWS (Community Work Space) booking management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CWS:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: CWS booking ID
 *           example: "1"
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: ID of responsible person
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (2-hour slots)
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (2-hour slots)
 *           example: "2025-09-01T15:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "10"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Team collaboration session"
 *         isDone:
 *           type: boolean
 *           description: Booking completion status
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T10:30:00.000Z"
 *         penanggungJawab:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: int64
 *               example: "1"
 *             namaLengkap:
 *               type: string
 *               example: "John Doe"
 *             namaPanggilan:
 *               type: string
 *               example: "John"
 *             nomorWa:
 *               type: string
 *               example: "+6281234567890"
 *     CreateCWSRequest:
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
 *           description: ID of responsible person
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (must be 2-hour slot)
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (must be 2-hour slot)
 *           example: "2025-09-01T15:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "10"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Team collaboration session"
 *         isDone:
 *           type: boolean
 *           description: Booking completion status
 *           example: false
 *     UpdateCWSRequest:
 *       type: object
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: ID of responsible person
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (must be 2-hour slot)
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (must be 2-hour slot)
 *           example: "2025-09-01T15:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "10"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Updated team collaboration session"
 *         isDone:
 *           type: boolean
 *           description: Booking completion status
 *           example: true
 *     TimeSlot:
 *       type: object
 *       properties:
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T15:00:00.000Z"
 *         display:
 *           type: string
 *           example: "20.00 - 22.00"
 *         available:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/v1/cws:
 *   get:
 *     tags: [CWS]
 *     summary: Get all CWS bookings
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all CWS bookings with pagination support
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (starts from 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: List of CWS bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/CWS'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     tags: [CWS]
 *     summary: Create new CWS booking
 *     security:
 *       - bearerAuth: []
 *     description: Create a new CWS booking with 2-hour time slot validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCWSRequest'
 *     responses:
 *       201:
 *         description: CWS booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CWS'
 *                 message:
 *                   type: string
 *                   example: "Booking CWS berhasil dibuat"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Conflict - Time slot already booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", cwsController.getAll);
router.post("/", cwsController.create);

/**
 * @swagger
 * /api/v1/cws/time-slots:
 *   get:
 *     tags: [CWS]
 *     summary: Get available time slots for CWS booking ⭐ SMART SLOTS
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Get available 2-hour time slots for CWS booking with smart availability checking
 *
 *       **✨ Features:**
 *       - Real-time availability checking
 *       - User-friendly display format
 *       - 2-hour slot validation
 *       - Excludes already booked times
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: Date for booking (YYYY-MM-DD format)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully
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
 *                     $ref: '#/components/schemas/TimeSlot'
 *                 message:
 *                   type: string
 *                   example: "Saran slot waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-slots", cwsController.getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/cws/time-suggestions:
 *   get:
 *     tags: [CWS]
 *     summary: Get time slot suggestions for CWS booking
 *     security:
 *       - bearerAuth: []
 *     description: Get suggested 2-hour time slots for CWS booking (without availability check)
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: Date for booking (YYYY-MM-DD format)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
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
 *                         example: "2025-09-01T13:00:00.000Z"
 *                       waktuBerakhir:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-01T15:00:00.000Z"
 *                 message:
 *                   type: string
 *                   example: "Saran slot waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-suggestions", cwsController.getTimeSlotSuggestions);

/**
 * @swagger
 * /api/v1/cws/penanggung-jawab/{penanggungJawabId}:
 *   get:
 *     tags: [CWS]
 *     summary: Get CWS bookings by responsible person
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: penanggungJawabId
 *         in: path
 *         required: true
 *         description: ID of responsible person
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: CWS bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/CWS'
 *                 message:
 *                   type: string
 *                   example: "Data CWS berhasil diambil"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/penanggung-jawab/:penanggungJawabId",
  cwsController.getCWSByPenanggungJawab
);

/**
 * @swagger
 * /api/v1/cws/{id}:
 *   get:
 *     tags: [CWS]
 *     summary: Get CWS booking by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: CWS booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: CWS booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CWS'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   put:
 *     tags: [CWS]
 *     summary: Update CWS booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: CWS booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCWSRequest'
 *     responses:
 *       200:
 *         description: CWS booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CWS'
 *                 message:
 *                   type: string
 *                   example: "Booking CWS berhasil diupdate"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Conflict - Time slot already booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     tags: [CWS]
 *     summary: Delete CWS booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: CWS booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: CWS booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", cwsController.getById);
router.put("/:id", cwsController.update);
router.delete("/:id", cwsController.delete);

export default router;
