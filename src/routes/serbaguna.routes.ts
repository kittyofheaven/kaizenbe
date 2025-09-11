import { Router } from "express";
import { SerbagunaController } from "../controllers/serbaguna.controller";

const router = Router();
const serbagunaController = new SerbagunaController();

/**
 * @swagger
 * tags:
 *   name: Serbaguna
 *   description: Serbaguna area booking management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Serbaguna:
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
 *         idArea:
 *           type: string
 *           format: int64
 *           description: Area ID
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
 *           example: "8"
 *         keterangan:
 *           type: string
 *           nullable: true
 *           description: Additional notes
 *           example: "Diskusi kelompok proyek"
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
 *         area:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: int64
 *             namaArea:
 *               type: string
 *             deskripsi:
 *               type: string
 *             kapasitas:
 *               type: string
 *               format: int64
 *     CreateSerbagunaRequest:
 *       type: object
 *       required:
 *         - idPenanggungJawab
 *         - idArea
 *         - waktuMulai
 *         - waktuBerakhir
 *         - jumlahPengguna
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: Responsible person ID (must exist in Users table)
 *           example: "1"
 *         idArea:
 *           type: string
 *           format: int64
 *           description: Area ID (must exist in AreaSerbaguna table)
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
 *           example: "8"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Diskusi kelompok proyek"
 *         isDone:
 *           type: boolean
 *           description: Completion status
 *           example: false
 *           default: false
 *     UpdateSerbagunaRequest:
 *       type: object
 *       properties:
 *         idPenanggungJawab:
 *           type: string
 *           format: int64
 *           description: Responsible person ID (must exist in Users table)
 *           example: "1"
 *         idArea:
 *           type: string
 *           format: int64
 *           description: Area ID (must exist in AreaSerbaguna table)
 *           example: "2"
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
 *           example: "8"
 *         keterangan:
 *           type: string
 *           description: Additional notes
 *           example: "Diskusi kelompok proyek"
 *         isDone:
 *           type: boolean
 *           description: Completion status
 *           example: true
 *     AreaSerbaguna:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           example: "1"
 *         namaArea:
 *           type: string
 *           example: "Area Meeting A"
 */

/**
 * @swagger
 * /api/v1/serbaguna:
 *   get:
 *     summary: Get all serbaguna bookings
 *     tags: [Serbaguna]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Serbaguna bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Serbaguna'
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
router.get("/", serbagunaController.getAll);

/**
 * @swagger
 * /api/v1/serbaguna/time-slots:
 *   get:
 *     summary: Get suggested time slots for serbaguna booking
 *     tags: [Serbaguna]
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
 *               message: "Saran slot waktu berhasil diambil"
 */
router.get("/time-slots", serbagunaController.getTimeSlotSuggestions);

/**
 * @swagger
 * /api/v1/serbaguna/areas:
 *   get:
 *     summary: Get all available serbaguna areas
 *     tags: [Serbaguna]
 *     responses:
 *       200:
 *         description: Available areas retrieved successfully
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
 *                     $ref: '#/components/schemas/AreaSerbaguna'
 *                 message:
 *                   type: string
 *                   example: "Data area serbaguna berhasil diambil"
 */
router.get("/areas", serbagunaController.getAvailableAreas);

/**
 * @swagger
 * /api/v1/serbaguna/{id}:
 *   get:
 *     summary: Get serbaguna booking by ID
 *     tags: [Serbaguna]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Serbaguna booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Serbaguna booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Serbaguna'
 *       404:
 *         description: Serbaguna booking not found
 */
router.get("/:id", serbagunaController.getById);

/**
 * @swagger
 * /api/v1/serbaguna:
 *   post:
 *     summary: Create new serbaguna booking
 *     tags: [Serbaguna]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSerbagunaRequest'
 *           examples:
 *             example1:
 *               summary: Meeting room booking
 *               value:
 *                 idPenanggungJawab: "1"
 *                 idArea: "1"
 *                 waktuMulai: "2024-01-15T13:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T14:00:00.000Z"
 *                 jumlahPengguna: "8"
 *                 keterangan: "Diskusi kelompok proyek"
 *             example2:
 *               summary: Study session
 *               value:
 *                 idPenanggungJawab: "2"
 *                 idArea: "2"
 *                 waktuMulai: "2024-01-15T19:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T20:00:00.000Z"
 *                 jumlahPengguna: "6"
 *                 keterangan: "Study group session"
 *                 isDone: false
 *     responses:
 *       200:
 *         description: Serbaguna booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Serbaguna'
 *                 message:
 *                   type: string
 *                   example: "Booking serbaguna berhasil dibuat"
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
 *                     - "Area serbaguna tidak ditemukan"
 *                     - "Area serbaguna sudah dibooking pada waktu tersebut"
 *                     - "Waktu booking tidak boleh di masa lalu"
 */
router.post("/", serbagunaController.create);

/**
 * @swagger
 * /api/v1/serbaguna/{id}:
 *   put:
 *     summary: Update serbaguna booking
 *     tags: [Serbaguna]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Serbaguna booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSerbagunaRequest'
 *           examples:
 *             updateTime:
 *               summary: Update booking time
 *               value:
 *                 waktuMulai: "2024-01-15T15:00:00.000Z"
 *                 waktuBerakhir: "2024-01-15T16:00:00.000Z"
 *             changeArea:
 *               summary: Change area
 *               value:
 *                 idArea: "2"
 *                 keterangan: "Pindah ke area yang lebih besar"
 *             markDone:
 *               summary: Mark as completed
 *               value:
 *                 isDone: true
 *                 keterangan: "Meeting selesai tepat waktu"
 *     responses:
 *       200:
 *         description: Serbaguna booking updated successfully
 *       404:
 *         description: Serbaguna booking not found
 *       400:
 *         description: Validation error
 */
router.put("/:id", serbagunaController.update);

/**
 * @swagger
 * /api/v1/serbaguna/{id}:
 *   delete:
 *     summary: Delete serbaguna booking
 *     tags: [Serbaguna]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Serbaguna booking ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Serbaguna booking deleted successfully
 *       404:
 *         description: Serbaguna booking not found
 */
router.delete("/:id", serbagunaController.delete);

/**
 * @swagger
 * /api/v1/serbaguna/penanggung-jawab/{penanggungJawabId}:
 *   get:
 *     summary: Get serbaguna bookings by responsible person
 *     tags: [Serbaguna]
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
 *         description: Serbaguna bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Serbaguna'
 */
router.get(
  "/penanggung-jawab/:penanggungJawabId",
  serbagunaController.getSerbagunaByPenanggungJawab
);

/**
 * @swagger
 * /api/v1/serbaguna/area/{areaId}:
 *   get:
 *     summary: Get serbaguna bookings by area
 *     tags: [Serbaguna]
 *     parameters:
 *       - name: areaId
 *         in: path
 *         required: true
 *         description: Area ID
 *         schema:
 *           type: string
 *           format: int64
 *     responses:
 *       200:
 *         description: Serbaguna bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Serbaguna'
 */
router.get("/area/:areaId", serbagunaController.getSerbagunaByArea);

/**
 * @swagger
 * /api/v1/serbaguna/available-slots/{date}/{areaId}:
 *   get:
 *     summary: Get available time slots for specific date and area
 *     tags: [Serbaguna]
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
 *       - name: areaId
 *         in: path
 *         required: true
 *         description: Area ID
 *         schema:
 *           type: string
 *           format: int64
 *         example: "1"
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
  "/available-slots/:date/:areaId",
  serbagunaController.getAvailableTimeSlots
);

export default router;
