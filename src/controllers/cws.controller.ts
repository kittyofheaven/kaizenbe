import { Request, Response, NextFunction } from "express";
import { CWS } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  CWSService,
  CreateCWSDTO,
  UpdateCWSDTO,
} from "../services/cws.service";
import { ResponseUtil } from "../utils/response";
import { TimeValidationUtil } from "../utils/time-validation";

export class CWSController extends BaseController<
  CWS,
  CreateCWSDTO,
  UpdateCWSDTO
> {
  private cwsService: CWSService;

  constructor() {
    const service = new CWSService();
    super(service);
    this.cwsService = service;
  }

  // Override create to handle BigInt conversion
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createData: CreateCWSDTO = {
        ...req.body,
        idPenanggungJawab: BigInt(req.body.idPenanggungJawab),
        jumlahPengguna: BigInt(req.body.jumlahPengguna),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuBerakhir: new Date(req.body.waktuBerakhir),
      };

      // Validate time slots (2 hours for CWS)
      if (
        !TimeValidationUtil.validateTwoHourSlot(
          createData.waktuMulai,
          createData.waktuBerakhir
        )
      ) {
        ResponseUtil.badRequest(
          res,
          "Waktu booking CWS harus dalam slot 2 jam penuh (contoh: 13:00-15:00)",
          ["Slot waktu tidak valid untuk CWS"]
        );
        return;
      }

      // Check if time is in the past
      if (createData.waktuMulai < new Date()) {
        ResponseUtil.badRequest(
          res,
          "Waktu booking tidak boleh di masa lalu",
          ["Waktu mulai harus di masa depan"]
        );
        return;
      }

      const result = await this.cwsService.create(createData);
      ResponseUtil.success(res, result, "Booking CWS berhasil dibuat");
    } catch (error: any) {
      if (error.message.includes("Conflict")) {
        ResponseUtil.error(res, error.message, 409);
      } else if (error.message.includes("tidak ditemukan")) {
        ResponseUtil.badRequest(res, error.message);
      } else if (error.message.includes("masa lalu")) {
        ResponseUtil.badRequest(res, error.message);
      } else if (error.message.includes("slot")) {
        ResponseUtil.badRequest(res, error.message);
      } else {
        next(error);
      }
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
      const updateData: UpdateCWSDTO = { ...req.body };

      // Convert BigInt fields if they exist
      if (updateData.idPenanggungJawab) {
        updateData.idPenanggungJawab = BigInt(updateData.idPenanggungJawab);
      }
      if (updateData.jumlahPengguna) {
        updateData.jumlahPengguna = BigInt(updateData.jumlahPengguna);
      }
      if (updateData.waktuMulai) {
        updateData.waktuMulai = new Date(updateData.waktuMulai);
      }
      if (updateData.waktuBerakhir) {
        updateData.waktuBerakhir = new Date(updateData.waktuBerakhir);
      }

      // Validate time slots if both times are provided
      if (updateData.waktuMulai && updateData.waktuBerakhir) {
        if (
          !TimeValidationUtil.validateTwoHourSlot(
            updateData.waktuMulai,
            updateData.waktuBerakhir
          )
        ) {
          ResponseUtil.badRequest(
            res,
            "Waktu booking CWS harus dalam slot 2 jam penuh (contoh: 13:00-15:00)",
            ["Slot waktu tidak valid untuk CWS"]
          );
          return;
        }

        // Check if time is in the past
        if (updateData.waktuMulai < new Date()) {
          ResponseUtil.badRequest(
            res,
            "Waktu booking tidak boleh di masa lalu",
            ["Waktu mulai harus di masa depan"]
          );
          return;
        }
      }

      const result = await this.cwsService.update(id, updateData);
      ResponseUtil.success(res, result, "Booking CWS berhasil diupdate");
    } catch (error: any) {
      if (error.message.includes("tidak ditemukan")) {
        ResponseUtil.notFound(res, error.message);
      } else if (error.message.includes("Conflict")) {
        ResponseUtil.error(res, error.message, 409);
      } else if (error.message.includes("masa lalu")) {
        ResponseUtil.badRequest(res, error.message);
      } else if (error.message.includes("slot")) {
        ResponseUtil.badRequest(res, error.message);
      } else {
        next(error);
      }
    }
  };

  // Custom endpoints
  getCWSByPenanggungJawab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const penanggungJawabId = BigInt(req.params.penanggungJawabId!);
      const cwsList = await this.cwsService.getCWSByPenanggungJawab(
        penanggungJawabId
      );
      ResponseUtil.success(res, cwsList, "Data CWS berhasil diambil");
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

      const timeSlots = await this.cwsService.getAvailableTimeSlots(dateObj);

      ResponseUtil.success(res, timeSlots, "Saran slot waktu berhasil diambil");
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

      const suggestions = TimeValidationUtil.getTwoHourTimeSlots(dateObj);
      ResponseUtil.success(
        res,
        suggestions,
        "Saran slot waktu berhasil diambil"
      );
    } catch (error) {
      next(error);
    }
  };
}
