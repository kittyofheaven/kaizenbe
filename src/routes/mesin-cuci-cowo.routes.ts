import { Router } from "express";
import { MesinCuciCowoController } from "../controllers/mesin-cuci-cowo.controller";

const router = Router();
const mesinCuciCowoController = new MesinCuciCowoController();

/**
 * @swagger
 * components:
 *   schemas:
 *     MesinCuciCowo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: Booking ID
 *           example: "1"
 *         idFasilitas:
 *           type: string
 *           format: int64
 *           description: Facility ID
 *           example: "1"
 *         idPeminjam:
 *           type: string
 *           format: int64
 *           description: Borrower ID
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time
 *           example: "2025-09-01T14:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         peminjam:
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
 *         fasilitas:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: int64
 *             nama:
 *               type: string
 *
 *     CreateMesinCuciCowoRequest:
 *       type: object
 *       required:
 *         - idFasilitas
 *         - idPeminjam
 *         - waktuMulai
 *         - waktuBerakhir
 *       properties:
 *         idFasilitas:
 *           type: string
 *           format: int64
 *           description: Facility ID
 *           example: "1"
 *         idPeminjam:
 *           type: string
 *           format: int64
 *           description: Borrower ID
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (must be 1-hour slot)
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (must be 1-hour slot)
 *           example: "2025-09-01T14:00:00.000Z"
 *       examples:
 *         - summary: Basic booking
 *           value:
 *             idFasilitas: "1"
 *             idPeminjam: "1"
 *             waktuMulai: "2025-09-01T13:00:00.000Z"
 *             waktuBerakhir: "2025-09-01T14:00:00.000Z"
 *
 *     UpdateMesinCuciCowoRequest:
 *       type: object
 *       properties:
 *         idFasilitas:
 *           type: string
 *           format: int64
 *           description: Facility ID
 *           example: "1"
 *         idPeminjam:
 *           type: string
 *           format: int64
 *           description: Borrower ID
 *           example: "1"
 *         waktuMulai:
 *           type: string
 *           format: date-time
 *           description: Start time (must be 1-hour slot)
 *           example: "2025-09-01T13:00:00.000Z"
 *         waktuBerakhir:
 *           type: string
 *           format: date-time
 *           description: End time (must be 1-hour slot)
 *           example: "2025-09-01T14:00:00.000Z"
 *       examples:
 *         - summary: Update time
 *           value:
 *             waktuMulai: "2025-09-01T14:00:00.000Z"
 *             waktuBerakhir: "2025-09-01T15:00:00.000Z"
 *
 *     FasilitasMesinCuciCowo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: Facility ID
 *           example: "1"
 *         nama:
 *           type: string
 *           description: Facility name
 *           example: "Mesin Cuci A - Cowo"
 */

/**
 * @swagger
 * tags:
 *   - name: MesinCuciCowo
 *     description: Men's washing machine booking management
 */

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get all men's washing machine bookings
 *     description: Retrieve paginated list of all men's washing machine bookings with borrower and facility details
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Successful response
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
 *                     $ref: '#/components/schemas/MesinCuciCowo'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginatedResponse'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", mesinCuciCowoController.getAll);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/time-slots:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get suggested time slots for men's washing machine booking
 *     description: Get available 1-hour time slots for a specific date and optionally facility
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: Date for booking (YYYY-MM-DD format)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *       - name: facilityId
 *         in: query
 *         required: false
 *         description: Specific facility ID to check availability
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: Available time slots
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
 *                         example: "2025-09-01T14:00:00.000Z"
 *                       display:
 *                         type: string
 *                         example: "20.00 - 21.00"
 *                 message:
 *                   type: string
 *                   example: "Saran slot waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-slots", mesinCuciCowoController.getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/facilities:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get all available men's washing machine facilities
 *     description: Retrieve list of all available men's washing machine facilities
 *     responses:
 *       200:
 *         description: Available facilities
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
 *                     $ref: '#/components/schemas/FasilitasMesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data fasilitas mesin cuci cowo berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/facilities", mesinCuciCowoController.getAvailableFacilities);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/{id}:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get men's washing machine booking by ID
 *     description: Retrieve a specific men's washing machine booking by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", mesinCuciCowoController.getById);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo:
 *   post:
 *     tags: [MesinCuciCowo]
 *     summary: Create new men's washing machine booking
 *     description: Create a new men's washing machine booking with 1-hour time slot validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMesinCuciCowoRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Booking mesin cuci cowo berhasil dibuat"
 *       400:
 *         description: Validation error
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
 *                     - "Waktu booking tidak boleh di masa lalu"
 *                     - "Peminjam tidak ditemukan"
 *                     - "Fasilitas mesin cuci cowo tidak ditemukan"
 *                     - "Mesin cuci sudah dibooking pada waktu tersebut. Pilih waktu lain."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", mesinCuciCowoController.create);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/{id}:
 *   put:
 *     tags: [MesinCuciCowo]
 *     summary: Update men's washing machine booking by ID
 *     description: Update an existing men's washing machine booking with validation
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMesinCuciCowoRequest'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Booking mesin cuci cowo berhasil diupdate"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", mesinCuciCowoController.update);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/{id}:
 *   delete:
 *     tags: [MesinCuciCowo]
 *     summary: Delete men's washing machine booking by ID
 *     description: Delete an existing men's washing machine booking
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", mesinCuciCowoController.delete);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/peminjam/{peminjamId}:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get men's washing machine bookings by borrower ID
 *     description: Retrieve all men's washing machine bookings for a specific borrower
 *     parameters:
 *       - name: peminjamId
 *         in: path
 *         required: true
 *         description: Borrower ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: Bookings by borrower
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
 *                     $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan peminjam berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/peminjam/:peminjamId",
  mesinCuciCowoController.getMesinCuciByPeminjam
);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/fasilitas/{fasilitasId}:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get men's washing machine bookings by facility ID
 *     description: Retrieve all men's washing machine bookings for a specific facility
 *     parameters:
 *       - name: fasilitasId
 *         in: path
 *         required: true
 *         description: Facility ID
 *         schema:
 *           type: string
 *           format: int64
 *           example: "1"
 *     responses:
 *       200:
 *         description: Bookings by facility
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
 *                     $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan fasilitas berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/fasilitas/:fasilitasId",
  mesinCuciCowoController.getMesinCuciByFasilitas
);

/**
 * @swagger
 * /api/v1/mesin-cuci-cowo/time-range:
 *   get:
 *     tags: [MesinCuciCowo]
 *     summary: Get men's washing machine bookings by time range
 *     description: Retrieve all men's washing machine bookings within a specific time range
 *     parameters:
 *       - name: startTime
 *         in: query
 *         required: true
 *         description: Start time (ISO 8601 format)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T00:00:00.000Z"
 *       - name: endTime
 *         in: query
 *         required: true
 *         description: End time (ISO 8601 format)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-09-01T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Bookings by time range
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
 *                     $ref: '#/components/schemas/MesinCuciCowo'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan rentang waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-range", mesinCuciCowoController.getMesinCuciByTimeRange);

export default router;


