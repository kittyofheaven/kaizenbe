import { Request, Response, NextFunction } from "express";
import { Serbaguna } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  SerbagunaService,
  CreateSerbagunaDTO,
  UpdateSerbagunaDTO,
} from "../services/serbaguna.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";

export class SerbagunaController extends BaseController<
  Serbaguna,
  CreateSerbagunaDTO,
  UpdateSerbagunaDTO
> {
  private serbagunaService: SerbagunaService;

  constructor() {
    const service = new SerbagunaService();
    super(service);
    this.serbagunaService = service;
  }

  // Override create to handle BigInt conversion
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateSerbagunaDTO = {
        idPenanggungJawab: BigInt(req.body.idPenanggungJawab),
        idArea: BigInt(req.body.idArea),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
        jumlahPengguna: BigInt(req.body.jumlahPengguna),
        keterangan: req.body.keterangan,
        isDone: req.body.isDone,
      };

      const result = await this.serbagunaService.create(createData);
      ResponseUtil.success(res, result, "Booking serbaguna berhasil dibuat");
    } catch (error) {
      // Handle validation errors directly
      if (error instanceof Error) {
        if (
          error.message.includes("Waktu booking harus dalam slot") ||
          error.message.includes("tidak boleh di masa lalu") ||
          error.message.includes("tidak ditemukan") ||
          error.message.includes("sudah dibooking")
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
      const updateData: UpdateSerbagunaDTO = {};

      if (req.body.idPenanggungJawab !== undefined) {
        updateData.idPenanggungJawab = BigInt(req.body.idPenanggungJawab);
      }
      if (req.body.idArea !== undefined) {
        updateData.idArea = BigInt(req.body.idArea);
      }
      if (req.body.waktuMulai !== undefined) {
        updateData.waktuMulai = new Date(req.body.waktuMulai);
      }
      if (req.body.waktuBerakhir !== undefined) {
        updateData.waktuBerakhir = new Date(req.body.waktuBerakhir);
      }
      if (req.body.jumlahPengguna !== undefined) {
        updateData.jumlahPengguna = BigInt(req.body.jumlahPengguna);
      }
      if (req.body.keterangan !== undefined) {
        updateData.keterangan = req.body.keterangan;
      }
      if (req.body.isDone !== undefined) {
        updateData.isDone = req.body.isDone;
      }

      const result = await this.serbagunaService.update(id, updateData);
      ResponseUtil.success(res, result, "Booking serbaguna berhasil diupdate");
    } catch (error) {
      // Handle validation errors directly
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
  getSerbagunaByPenanggungJawab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const penanggungJawabId = BigInt(req.params.penanggungJawabId!);
      const serbagunas =
        await this.serbagunaService.getSerbagunaByPenanggungJawab(
          penanggungJawabId
        );
      ResponseUtil.success(res, serbagunas, "Data serbaguna berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getSerbagunaByArea = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const areaId = BigInt(req.params.areaId!);
      const serbagunas = await this.serbagunaService.getSerbagunaByArea(areaId);
      ResponseUtil.success(res, serbagunas, "Data serbaguna berhasil diambil");
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
      const date = new Date(req.params.date!);
      const areaId = BigInt(req.params.areaId!);

      if (isNaN(date.getTime())) {
        ResponseUtil.badRequest(
          res,
          "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
        );
        return;
      }

      const slots = await this.serbagunaService.getAvailableTimeSlots(
        date,
        areaId
      );
      ResponseUtil.success(res, slots, "Slot waktu tersedia berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getTimeSlotSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const date = req.query.date
        ? new Date(req.query.date as string)
        : new Date();

      if (isNaN(date.getTime())) {
        ResponseUtil.badRequest(
          res,
          "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
        );
        return;
      }

      const slots = TimeValidationUtil.getTwoHourTimeSlots(date);
      const formattedSlots = slots.map((slot) => ({
        waktuMulai: slot.waktuMulai.toISOString(),
        waktuBerakhir: slot.waktuBerakhir.toISOString(),
        display: TimeValidationUtil.formatTimeSlot(
          slot.waktuMulai,
          slot.waktuBerakhir
        ),
      }));

      ResponseUtil.success(
        res,
        formattedSlots,
        "Saran slot waktu berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };

  getAvailableAreas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const areas = await this.serbagunaService.getAvailableAreas();
      ResponseUtil.success(res, areas, "Data area serbaguna berhasil diambil");
    } catch (error) {
      next(error);
    }
  };
}
