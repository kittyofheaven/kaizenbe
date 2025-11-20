import { Request, Response, NextFunction } from "express";
import { Dapur } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  DapurService,
  CreateDapurDTO,
  UpdateDapurDTO,
} from "../services/dapur.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";
import { AccessControlUtil } from "../utils/access-control";

export class DapurController extends BaseController<
  Dapur,
  CreateDapurDTO,
  UpdateDapurDTO
> {
  private dapurService: DapurService;

  constructor() {
    const service = new DapurService();
    super(service);
    this.dapurService = service;
  }

  // Override create to handle BigInt conversion
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateDapurDTO = {
        idFasilitas: BigInt(req.body.idFasilitas),
        idPeminjam: BigInt(req.body.idPeminjam),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
        pinjamPeralatan: Boolean(req.body.pinjamPeralatan),
      };

      const result = await this.dapurService.create(createData);
      ResponseUtil.success(res, result, "Booking dapur berhasil dibuat");
    } catch (error) {
      // Handle specific validation errors
      if (error instanceof Error) {
        if (
          error.message.includes("Waktu booking harus dalam slot") ||
          error.message.includes("tidak boleh di masa lalu") ||
          error.message.includes("tidak ditemukan") ||
          error.message.includes("sudah dibooking") ||
          error.message.includes("Resource not found")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  // Override update to handle BigInt conversion
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id!);
      const updateData: UpdateDapurDTO = {};

      if (req.body.idFasilitas !== undefined) {
        updateData.idFasilitas = BigInt(req.body.idFasilitas);
      }
      if (req.body.idPeminjam !== undefined) {
        updateData.idPeminjam = BigInt(req.body.idPeminjam);
      }
      if (req.body.waktuMulai !== undefined) {
        updateData.waktuMulai = new Date(req.body.waktuMulai);
      }
      if (req.body.waktuBerakhir !== undefined) {
        updateData.waktuBerakhir = new Date(req.body.waktuBerakhir);
      }
      if (req.body.pinjamPeralatan !== undefined) {
        updateData.pinjamPeralatan = Boolean(req.body.pinjamPeralatan);
      }

      const result = await this.dapurService.update(id, updateData);
      ResponseUtil.success(res, result, "Booking dapur berhasil diupdate");
    } catch (error) {
      // Handle specific validation errors
      if (error instanceof Error) {
        if (
          error.message.includes("Waktu booking harus dalam slot") ||
          error.message.includes("tidak boleh di masa lalu") ||
          error.message.includes("tidak ditemukan") ||
          error.message.includes("sudah dibooking") ||
          error.message.includes("Resource not found")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  // Custom endpoints
  getDapurByPeminjam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const peminjamId = BigInt(req.params.peminjamId!);
      const bookings = await this.dapurService.getDapurByPeminjam(peminjamId);
      ResponseUtil.success(
        res,
        bookings,
        "Data booking berdasarkan peminjam berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getDapurByFasilitas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const fasilitasId = BigInt(req.params.fasilitasId!);
      const bookings = await this.dapurService.getDapurByFasilitas(fasilitasId);
      ResponseUtil.success(
        res,
        bookings,
        "Data booking berdasarkan fasilitas berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getDapurByTimeRange = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { startTime, endTime } = req.query;

      if (!startTime || !endTime) {
        ResponseUtil.badRequest(
          res,
          "Parameter startTime dan endTime harus diisi"
        );
        return;
      }

      const start = new Date(startTime as string);
      const end = new Date(endTime as string);

      const bookings = await this.dapurService.getDapurByTimeRange(start, end);
      ResponseUtil.success(
        res,
        bookings,
        "Data booking berdasarkan rentang waktu berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getAvailableFacilities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const facilities = await this.dapurService.getAvailableFacilities();
      ResponseUtil.success(
        res,
        facilities,
        "Data fasilitas dapur berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getAvailableTimeSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { date, facilityId } = req.query;

      if (!date) {
        ResponseUtil.badRequest(
          res,
          "Parameter date harus diisi (format: YYYY-MM-DD)"
        );
        return;
      }

      const facilityIdBigInt = facilityId
        ? BigInt(facilityId as string)
        : undefined;
      const timeSlots = await this.dapurService.getAvailableTimeSlots(
        date as string,
        facilityIdBigInt
      );

      ResponseUtil.success(res, timeSlots, "Saran slot waktu berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  // Override delete to enforce ownership/admin rules
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res, "Access token is required");
        return;
      }

      const bookingId = BigInt(req.params.id!);
      const currentUserId = BigInt(req.user.id);

      const booking = await this.dapurService.getById(bookingId);

      const isAdmin = await AccessControlUtil.isAdmin(currentUserId);
      if (!isAdmin && booking.idPeminjam !== currentUserId) {
        ResponseUtil.forbidden(res, "Access denied");
        return;
      }

      await this.dapurService.delete(bookingId);
      ResponseUtil.success(res, null, "Resource deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Resource not found")) {
        ResponseUtil.notFound(res, "Resource not found");
        return;
      }
      next(error);
    }
  };
}

