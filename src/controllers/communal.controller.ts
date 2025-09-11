import { Request, Response, NextFunction } from "express";
import { Communal } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  CommunalService,
  CreateCommunalDTO,
  UpdateCommunalDTO,
} from "../services/communal.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";

export class CommunalController extends BaseController<
  Communal,
  CreateCommunalDTO,
  UpdateCommunalDTO
> {
  private communalService: CommunalService;

  constructor() {
    const service = new CommunalService();
    super(service);
    this.communalService = service;
  }

  // Override create to handle BigInt conversion
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateCommunalDTO = {
        idPenanggungJawab: BigInt(req.body.idPenanggungJawab),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
        jumlahPengguna: BigInt(req.body.jumlahPengguna),
        lantai: BigInt(req.body.lantai),
        keterangan: req.body.keterangan,
        isDone: req.body.isDone,
      };

      const result = await this.communalService.create(createData);
      ResponseUtil.success(res, result, "Booking communal berhasil dibuat");
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
      const updateData: UpdateCommunalDTO = {};

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
      if (req.body.lantai !== undefined) {
        updateData.lantai = BigInt(req.body.lantai);
      }
      if (req.body.keterangan !== undefined) {
        updateData.keterangan = req.body.keterangan;
      }
      if (req.body.isDone !== undefined) {
        updateData.isDone = req.body.isDone;
      }

      const result = await this.communalService.update(id, updateData);
      ResponseUtil.success(res, result, "Booking communal berhasil diupdate");
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
  getCommunalByPenanggungJawab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const penanggungJawabId = BigInt(req.params.penanggungJawabId!);
      const communals = await this.communalService.getCommunalByPenanggungJawab(
        penanggungJawabId
      );
      ResponseUtil.success(res, communals, "Data communal berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getCommunalByLantai = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const lantai = BigInt(req.params.lantai!);
      const communals = await this.communalService.getCommunalByLantai(lantai);
      ResponseUtil.success(res, communals, "Data communal berhasil diambil");
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
      const lantai = BigInt(req.params.lantai!);

      if (isNaN(date.getTime())) {
        ResponseUtil.badRequest(
          res,
          "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
        );
        return;
      }

      const slots = await this.communalService.getAvailableTimeSlots(
        date,
        lantai
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

      const slots = TimeValidationUtil.getOneHourTimeSlots(date);
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
