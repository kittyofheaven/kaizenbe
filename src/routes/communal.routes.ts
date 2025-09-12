import { Router } from "express";
import { CommunalController } from "../controllers/communal.controller";

const router = Router();
const communalController = new CommunalController();

/**
 * @swagger
 * tags:
 *   name: Communal
 *   description: Communal room booking management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Communal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: Booking ID
 *           example: "1"
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: Responsible person ID
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (must be exact hour)
 *           example: "2024-01-15T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (must be exactly 1 hour after start)
 *           example: "2024-01-15T14:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "5"
 *         lantai:
 *           type: string
 *           format: int64
 *           description: Floor number
 *           example: "2"
 *         keterangan:
 *           type: string
 *           nullable: true
 *           description: Additional notes
 *           example: "Meeting rutin mingguan"
 *         isDone:
 *           type: boolean
 *           description: Completion status
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
 *     CreateCommunalRequest:
 *       type: object
 *       required:
 *         - idPenanggungJawab
 *         - waktuMulai
 *         - waktuBerakhir
 *         - jumlahPengguna
 *         - lantai
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: Responsible person ID (must exist in Users table)
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time - must be exact hour (e.g., 13:00:00)
 *           example: "2024-01-15T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time - must be exactly 1 hour after start time
 *           example: "2024-01-15T14:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "5"
 *         lantai:
 *           type: string
 *           format: int64
 *           description: Floor number
 *           example: "2"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Meeting rutin mingguan"
 *         isDone:
 *           type: boolean
 *           description: Completion status
 *           example: false
 *           default: false
 *     UpdateCommunalRequest:
 *       type: object
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: Responsible person ID (must exist in Users table)
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time - must be exact hour
 *           example: "2024-01-15T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time - must be exactly 1 hour after start time
 *           example: "2024-01-15T14:00:00.000Z"
 *         jumlahPengguna:
 *           type: string
 *           format: int64
 *           description: Number of users
 *           example: "5"
 *         lantai:
 *           type: string
 *           format: int64
 *           description: Floor number
 *           example: "2"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Meeting rutin mingguan"
 *         isDone:
 *           type: boolean
 *           description: Completion status
 *           example: true
 *     TimeSlot:
 *       type: object
 *       properties:
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T14:00:00.000Z"
 *         display:
 *           type: string
 *           example: "13:00 - 14:00"
 *         available:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/v1/communal:
 *   get:
 *     summary: Get all communal bookings
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Communal bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Communal'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", communalController.getAll);

/**
 * @swagger
 * /api/v1/communal/time-slots:
 *   get:
 *     summary: Get suggested time slots for communal booking
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: query
 *         description: Date for time slots (defaults to today)
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
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
 *                     $ref: '#/components/schemas/TimeSlot'
 *             example:
 *               success: true
 *               data:
 *                 - waktuMulai: "2024-01-15T06:00:00.000Z"
 *                   waktuBerakhir: "2024-01-15T07:00:00.000Z"
 *                   display: "06:00 - 07:00"
 *                 - waktuMulai: "2024-01-15T07:00:00.000Z"
 *                   waktuBerakhir: "2024-01-15T08:00:00.000Z"
 *                   display: "07:00 - 08:00"
 *               message: "Saran slot waktu berhasil diambil"
 */
router.get("/time-slots", communalController.getTimeSlotSuggestions);

/**
 * @swagger
 * /api/v1/communal/{id}:
 *   get:
 *     summary: Get communal booking by ID
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Communal booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Communal booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Communal'
 *       404:
 *         description: Communal booking not found
 */
router.get("/:id", communalController.getById);

/**
 * @swagger
 * /api/v1/communal:
 *   post:
 *     summary: Create new communal booking
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommunalRequest'
 *           examples:
 *             example1:
 *               summary: Basic booking
 *               value:
 *                 idPenanggungJawab: "1"
 *                 waktuMulai: "2024-01-15T13:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T14:00:00.000Z"
 *                 jumlahPengguna: "5"
 *                 lantai: "2"
 *                 keterangan: "Meeting rutin mingguan"
 *             example2:
 *               summary: Evening booking
 *               value:
 *                 idPenanggungJawab: "2"
 *                 waktuMulai: "2024-01-15T19:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T20:00:00.000Z"
 *                 jumlahPengguna: "10"
 *                 lantai: "3"
 *                 keterangan: "Study group session"
 *                 isDone: false
 *     responses:
 *       200:
 *         description: Communal booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Communal'
 *                 message:
 *                   type: string
 *                   example: "Booking communal berhasil dibuat"
 *       400:
 *         description: Bad request - validation errors
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
 *                     - "Waktu booking harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
 *                     - "Penanggung jawab tidak ditemukan"
 *                     - "Ruang communal lantai 2 sudah dibooking pada waktu tersebut"
 *                     - "Waktu booking tidak boleh di masa lalu"
 */
router.post("/", communalController.create);

/**
 * @swagger
 * /api/v1/communal/{id}:
 *   put:
 *     summary: Update communal booking
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Communal booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommunalRequest'
 *           examples:
 *             updateTime:
 *               summary: Update booking time
 *               value:
 *                 waktuMulai: "2024-01-15T15:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T16:00:00.000Z"
 *             markDone:
 *               summary: Mark as completed
 *               value:
 *                 isDone: true
 *                 keterangan: "Meeting selesai tepat waktu"
 *     responses:
 *       200:
 *         description: Communal booking updated successfully
 *       404:
 *         description: Communal booking not found
 *       400:
 *         description: Validation error
 */
router.put("/:id", communalController.update);

/**
 * @swagger
 * /api/v1/communal/{id}:
 *   delete:
 *     summary: Delete communal booking
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Communal booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Communal booking deleted successfully
 *       404:
 *         description: Communal booking not found
 */
router.delete("/:id", communalController.delete);

/**
 * @swagger
 * /api/v1/communal/penanggung-jawab/{penanggungJawabId}:
 *   get:
 *     summary: Get communal bookings by responsible person
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: penanggungJawabId
 *         in: path
 *         required: true
 *         description: Responsible person ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Communal bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Communal'
 */
router.get(
  "/penanggung-jawab/:penanggungJawabId",
  communalController.getCommunalByPenanggungJawab
);

/**
 * @swagger
 * /api/v1/communal/lantai/{lantai}:
 *   get:
 *     summary: Get communal bookings by floor
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: lantai
 *         in: path
 *         required: true
 *         description: Floor number
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Communal bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Communal'
 */
router.get("/lantai/:lantai", communalController.getCommunalByLantai);

/**
 * @swagger
 * /api/v1/communal/available-slots/{date}/{lantai}:
 *   get:
 *     summary: Get available time slots for specific date and floor
 *     tags: [Communal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
 *       - name: lantai
 *         in: path
 *         required: true
 *         description: Floor number
 *         schema:
 *           type: string
 *           format: int64
 *         example: "2"
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/TimeSlot'
 *                       - type: object
 *                         properties:
 *                           available:
 *                             type: boolean
 *                             description: Whether this slot is available for booking
 *             example:
 *               success: true
 *               data:
 *                 - waktuMulai: "2024-01-15T06:00:00.000Z"
 *                   waktuBerakhir: "2024-01-15T07:00:00.000Z"
 *                   available: true
 *                 - waktuMulai: "2024-01-15T13:00:00.000Z"
 *                   waktuBerakhir: "2024-01-15T14:00:00.000Z"
 *                   available: false
 *       400:
 *         description: Invalid date format
 */
router.get(
  "/available-slots/:date/:lantai",
  communalController.getAvailableTimeSlots
);

export default router;
