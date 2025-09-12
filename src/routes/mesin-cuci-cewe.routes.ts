import { Router } from "express";
import { MesinCuciCeweController } from "../controllers/mesin-cuci-cewe.controller";

const router = Router();
const mesinCuciCeweController = new MesinCuciCeweController();

/**
 * @swagger
 * components:
 *   schemas:
 *     MesinCuciCewe:
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
 *     CreateMesinCuciCeweRequest:
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
 *     UpdateMesinCuciCeweRequest:
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
 *     FasilitasMesinCuciCewe:
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
 *           example: "Mesin Cuci A - Cewe"
 */

/**
 * @swagger
 * tags:
 *   - name: MesinCuciCewe
 *     description: Women's washing machine booking management
 */

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get all women's washing machine bookings
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve paginated list of all women's washing machine bookings with borrower and facility details
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
 *                     $ref: '#/components/schemas/MesinCuciCewe'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginatedResponse'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", mesinCuciCeweController.getAll);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/time-slots:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get suggested time slots for women's washing machine booking
 *     security:
 *       - bearerAuth: []
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
router.get("/time-slots", mesinCuciCeweController.getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/facilities:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get all available women's washing machine facilities
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve list of all available women's washing machine facilities
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
 *                     $ref: '#/components/schemas/FasilitasMesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data fasilitas mesin cuci cewe berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/facilities", mesinCuciCeweController.getAvailableFacilities);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/{id}:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get women's washing machine booking by ID
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a specific women's washing machine booking by its ID
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
 *                   $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", mesinCuciCeweController.getById);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe:
 *   post:
 *     tags: [MesinCuciCewe]
 *     summary: Create new women's washing machine booking
 *     security:
 *       - bearerAuth: []
 *     description: Create a new women's washing machine booking with 1-hour time slot validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMesinCuciCeweRequest'
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
 *                   $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Booking mesin cuci cewe berhasil dibuat"
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
 *                     - "Fasilitas mesin cuci cewe tidak ditemukan"
 *                     - "Mesin cuci sudah dibooking pada waktu tersebut. Pilih waktu lain."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", mesinCuciCeweController.create);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/{id}:
 *   put:
 *     tags: [MesinCuciCewe]
 *     summary: Update women's washing machine booking by ID
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing women's washing machine booking with validation
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
 *             $ref: '#/components/schemas/UpdateMesinCuciCeweRequest'
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
 *                   $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Booking mesin cuci cewe berhasil diupdate"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", mesinCuciCeweController.update);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/{id}:
 *   delete:
 *     tags: [MesinCuciCewe]
 *     summary: Delete women's washing machine booking by ID
 *     security:
 *       - bearerAuth: []
 *     description: Delete an existing women's washing machine booking
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
 *                   $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", mesinCuciCeweController.delete);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/peminjam/{peminjamId}:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get women's washing machine bookings by borrower ID
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all women's washing machine bookings for a specific borrower
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
 *                     $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan peminjam berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/peminjam/:peminjamId",
  mesinCuciCeweController.getMesinCuciByPeminjam
);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/fasilitas/{fasilitasId}:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get women's washing machine bookings by facility ID
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all women's washing machine bookings for a specific facility
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
 *                     $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan fasilitas berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/fasilitas/:fasilitasId",
  mesinCuciCeweController.getMesinCuciByFasilitas
);

/**
 * @swagger
 * /api/v1/mesin-cuci-cewe/time-range:
 *   get:
 *     tags: [MesinCuciCewe]
 *     summary: Get women's washing machine bookings by time range
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all women's washing machine bookings within a specific time range
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
 *                     $ref: '#/components/schemas/MesinCuciCewe'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan rentang waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-range", mesinCuciCeweController.getMesinCuciByTimeRange);

export default router;


