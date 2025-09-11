import { Request, Response, NextFunction } from "express";
import { MesinCuciCowo } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  MesinCuciCowoService,
  CreateMesinCuciCowoDTO,
  UpdateMesinCuciCowoDTO,
} from "../services/mesin-cuci-cowo.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";

export class MesinCuciCowoController extends BaseController<
  MesinCuciCowo,
  CreateMesinCuciCowoDTO,
  UpdateMesinCuciCowoDTO
> {
  private mesinCuciCowoService: MesinCuciCowoService;

  constructor() {
    const service = new MesinCuciCowoService();
    super(service);
    this.mesinCuciCowoService = service;
  }

  // Override create to handle BigInt conversion
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateMesinCuciCowoDTO = {
        idFasilitas: BigInt(req.body.idFasilitas),
        idPeminjam: BigInt(req.body.idPeminjam),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
      };

      const result = await this.mesinCuciCowoService.create(createData);
      ResponseUtil.success(
        res,
        result,
        "Booking mesin cuci cowo berhasil dibuat"
      );
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
      const updateData: UpdateMesinCuciCowoDTO = {};

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

      const result = await this.mesinCuciCowoService.update(id, updateData);
      ResponseUtil.success(
        res,
        result,
        "Booking mesin cuci cowo berhasil diupdate"
      );
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
  getMesinCuciByPeminjam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const peminjamId = BigInt(req.params.peminjamId!);
      const bookings = await this.mesinCuciCowoService.getMesinCuciByPeminjam(
        peminjamId
      );
      ResponseUtil.success(
        res,
        bookings,
        "Data booking berdasarkan peminjam berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getMesinCuciByFasilitas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const fasilitasId = BigInt(req.params.fasilitasId!);
      const bookings = await this.mesinCuciCowoService.getMesinCuciByFasilitas(
        fasilitasId
      );
      ResponseUtil.success(
        res,
        bookings,
        "Data booking berdasarkan fasilitas berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getMesinCuciByTimeRange = async (
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

      const bookings = await this.mesinCuciCowoService.getMesinCuciByTimeRange(
        start,
        end
      );
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
      const facilities =
        await this.mesinCuciCowoService.getAvailableFacilities();
      ResponseUtil.success(
        res,
        facilities,
        "Data fasilitas mesin cuci cowo berhasil diambil"
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
      const timeSlots = await this.mesinCuciCowoService.getAvailableTimeSlots(
        date as string,
        facilityIdBigInt
      );

      ResponseUtil.success(res, timeSlots, "Saran slot waktu berhasil diambil");
    } catch (error) {
      next(error);
    }
  };
}


