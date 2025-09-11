import { Router } from "express";
import { DapurController } from "../controllers/dapur.controller";

const router = Router();
const dapurController = new DapurController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dapur:
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
 *         pinjamPeralatan:
 *           type: boolean
 *           description: Whether borrowing equipment
 *           example: true
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
 *             fasilitas:
 *               type: string
 *
 *     CreateDapurRequest:
 *       type: object
 *       required:
 *         - idFasilitas
 *         - idPeminjam
 *         - waktuMulai
 *         - waktuBerakhir
 *         - pinjamPeralatan
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
 *         pinjamPeralatan:
 *           type: boolean
 *           description: Whether borrowing kitchen equipment
 *           example: true
 *       examples:
 *         - summary: Kitchen booking with equipment
 *           value:
 *             idFasilitas: "1"
 *             idPeminjam: "1"
 *             waktuMulai: "2025-09-01T13:00:00.000Z"
 *             waktuBerakhir: "2025-09-01T14:00:00.000Z"
 *             pinjamPeralatan: true
 *         - summary: Kitchen booking without equipment
 *           value:
 *             idFasilitas: "2"
 *             idPeminjam: "2"
 *             waktuMulai: "2025-09-01T15:00:00.000Z"
 *             waktuBerakhir: "2025-09-01T16:00:00.000Z"
 *             pinjamPeralatan: false
 *
 *     UpdateDapurRequest:
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
 *         pinjamPeralatan:
 *           type: boolean
 *           description: Whether borrowing kitchen equipment
 *           example: false
 *       examples:
 *         - summary: Update equipment borrowing status
 *           value:
 *             pinjamPeralatan: false
 *         - summary: Update time and equipment
 *           value:
 *             waktuMulai: "2025-09-01T14:00:00.000Z"
 *             waktuBerakhir: "2025-09-01T15:00:00.000Z"
 *             pinjamPeralatan: true
 *
 *     FasilitasDapur:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: Facility ID
 *           example: "1"
 *         fasilitas:
 *           type: string
 *           description: Kitchen facility name
 *           example: "Kompor Gas"
 */

/**
 * @swagger
 * tags:
 *   - name: Dapur
 *     description: Kitchen facility booking management
 */

/**
 * @swagger
 * /api/v1/dapur:
 *   get:
 *     tags: [Dapur]
 *     summary: Get all kitchen bookings
 *     description: Retrieve paginated list of all kitchen bookings with borrower and facility details
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
 *                     $ref: '#/components/schemas/Dapur'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginatedResponse'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", dapurController.getAll);

/**
 * @swagger
 * /api/v1/dapur/time-slots:
 *   get:
 *     tags: [Dapur]
 *     summary: Get suggested time slots for kitchen booking
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
router.get("/time-slots", dapurController.getAvailableTimeSlots);

/**
 * @swagger
 * /api/v1/dapur/facilities:
 *   get:
 *     tags: [Dapur]
 *     summary: Get all available kitchen facilities
 *     description: Retrieve list of all available kitchen facilities and equipment
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
 *                     $ref: '#/components/schemas/FasilitasDapur'
 *                 message:
 *                   type: string
 *                   example: "Data fasilitas dapur berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/facilities", dapurController.getAvailableFacilities);

/**
 * @swagger
 * /api/v1/dapur/{id}:
 *   get:
 *     tags: [Dapur]
 *     summary: Get kitchen booking by ID
 *     description: Retrieve a specific kitchen booking by its ID
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
 *                   $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Data retrieved successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", dapurController.getById);

/**
 * @swagger
 * /api/v1/dapur:
 *   post:
 *     tags: [Dapur]
 *     summary: Create new kitchen booking
 *     description: Create a new kitchen booking with 1-hour time slot validation and equipment borrowing option
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDapurRequest'
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
 *                   $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Booking dapur berhasil dibuat"
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
 *                     - "Fasilitas dapur tidak ditemukan"
 *                     - "Dapur sudah dibooking pada waktu tersebut. Pilih waktu lain."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", dapurController.create);

/**
 * @swagger
 * /api/v1/dapur/{id}:
 *   put:
 *     tags: [Dapur]
 *     summary: Update kitchen booking by ID
 *     description: Update an existing kitchen booking with validation
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
 *             $ref: '#/components/schemas/UpdateDapurRequest'
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
 *                   $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Booking dapur berhasil diupdate"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", dapurController.update);

/**
 * @swagger
 * /api/v1/dapur/{id}:
 *   delete:
 *     tags: [Dapur]
 *     summary: Delete kitchen booking by ID
 *     description: Delete an existing kitchen booking
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
 *                   $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Data deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", dapurController.delete);

/**
 * @swagger
 * /api/v1/dapur/peminjam/{peminjamId}:
 *   get:
 *     tags: [Dapur]
 *     summary: Get kitchen bookings by borrower ID
 *     description: Retrieve all kitchen bookings for a specific borrower
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
 *                     $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan peminjam berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/peminjam/:peminjamId", dapurController.getDapurByPeminjam);

/**
 * @swagger
 * /api/v1/dapur/fasilitas/{fasilitasId}:
 *   get:
 *     tags: [Dapur]
 *     summary: Get kitchen bookings by facility ID
 *     description: Retrieve all kitchen bookings for a specific facility
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
 *                     $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan fasilitas berhasil diambil"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/fasilitas/:fasilitasId", dapurController.getDapurByFasilitas);

/**
 * @swagger
 * /api/v1/dapur/time-range:
 *   get:
 *     tags: [Dapur]
 *     summary: Get kitchen bookings by time range
 *     description: Retrieve all kitchen bookings within a specific time range
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
 *                     $ref: '#/components/schemas/Dapur'
 *                 message:
 *                   type: string
 *                   example: "Data booking berdasarkan rentang waktu berhasil diambil"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/time-range", dapurController.getDapurByTimeRange);

export default router;


