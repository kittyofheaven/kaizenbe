import { Request, Response, NextFunction } from "express";
import { Theater } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  CreateTheaterDTO,
  TheaterService,
  UpdateTheaterDTO,
} from "../services/theater.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";

export class TheaterController extends BaseController<
  Theater,
  CreateTheaterDTO,
  UpdateTheaterDTO
> {
  private theaterService: TheaterService;

  constructor() {
    const service = new TheaterService();
    super(service);
    this.theaterService = service;
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateTheaterDTO = {
        idPenanggungJawab: BigInt(req.body.idPenanggungJawab),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
        jumlahPengguna: BigInt(req.body.jumlahPengguna),
        keterangan: req.body.keterangan,
        isDone: req.body.isDone,
      };

      const result = await this.theaterService.create(createData);
      ResponseUtil.success(res, result, "Booking theater berhasil dibuat");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("slot") ||
          error.message.includes("masa lalu") ||
          error.message.includes("tidak ditemukan") ||
          error.message.includes("sudah dibooking") ||
          error.message.includes("Resource not found") ||
          error.message.includes("Cannot convert")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id!);
      const updateData: UpdateTheaterDTO = {};

      if (req.body.idPenanggungJawab !== undefined) {
        updateData.idPenanggungJawab = BigInt(req.body.idPenanggungJawab);
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

      const result = await this.theaterService.update(id, updateData);
      ResponseUtil.success(res, result, "Booking theater berhasil diupdate");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("slot") ||
          error.message.includes("masa lalu") ||
          error.message.includes("tidak ditemukan") ||
          error.message.includes("sudah dibooking") ||
          error.message.includes("Resource not found") ||
          error.message.includes("Cannot convert")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  getTheaterByPenanggungJawab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const penanggungJawabId = BigInt(req.params.penanggungJawabId!);
      const data = await this.theaterService.getTheaterByPenanggungJawab(
        penanggungJawabId
      );
      ResponseUtil.success(res, data, "Data theater berhasil diambil");
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
      const { date } = req.query;

      if (!date) {
        ResponseUtil.badRequest(
          res,
          "Parameter date harus diisi (format: YYYY-MM-DD)"
        );
        return;
      }

      const dateObj = new Date(date as string);
      if (isNaN(dateObj.getTime())) {
        ResponseUtil.badRequest(
          res,
          "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
        );
        return;
      }

      const slots = await this.theaterService.getAvailableTimeSlots(dateObj);
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
      const { date } = req.query;
      const dateObj = date ? new Date(date as string) : new Date();

      if (isNaN(dateObj.getTime())) {
        ResponseUtil.badRequest(
          res,
          "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
        );
        return;
      }

      const slots = TimeValidationUtil.getOneHourTimeSlots(dateObj);
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
}
