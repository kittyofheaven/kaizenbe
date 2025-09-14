import { CWS, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { CWSRepository } from "../repositories/cws.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateCWSDTO {
  idPenanggungJawab: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
  jumlahPengguna: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export interface UpdateCWSDTO {
  idPenanggungJawab?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
  jumlahPengguna?: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export class CWSService extends BaseService<
  CWS,
  CreateCWSDTO,
  UpdateCWSDTO,
  Prisma.CWSCreateInput,
  Prisma.CWSUpdateInput
> {
  private cwsRepository: CWSRepository;

  constructor() {
    const repository = new CWSRepository();
    super(repository);
    this.cwsRepository = repository;
  }

  async create(data: CreateCWSDTO): Promise<CWS> {
    // Validate time slots (2 hours for CWS)
    if (
      !TimeValidationUtil.validateTwoHourSlot(
        data.waktuMulai,
        data.waktuBerakhir
      )
    ) {
      throw new Error(
        "Waktu booking CWS harus dalam slot 2 jam penuh (contoh: 13:00-15:00)"
      );
    }

    // Validate future time
    if (!TimeValidationUtil.validateFutureTime(data.waktuMulai)) {
      throw new Error("Waktu booking tidak boleh di masa lalu");
    }

    // Validate foreign key - check if user exists
    const userExists = await prisma.users.findUnique({
      where: { id: data.idPenanggungJawab },
    });
    if (!userExists) {
      throw new Error("Penanggung jawab tidak ditemukan");
    }

    // Check for time conflicts (CWS is a unique facility)
    const conflicts = await this.cwsRepository.checkTimeConflict(
      data.waktuMulai,
      data.waktuBerakhir
    );
    if (conflicts.length > 0) {
      throw new Error("CWS sudah dibooking pada waktu tersebut");
    }

    const input = this.mapCreateDTOToInput(data);
    return this.repository.create(input);
  }

  async update(id: bigint, data: UpdateCWSDTO): Promise<CWS> {
    // Get existing record
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Resource not found");
    }

    // Validate time slots if time is being updated
    if (data.waktuMulai && data.waktuBerakhir) {
      if (
        !TimeValidationUtil.validateTwoHourSlot(
          data.waktuMulai,
          data.waktuBerakhir
        )
      ) {
        throw new Error(
          "Waktu booking CWS harus dalam slot 2 jam penuh (contoh: 13:00-15:00)"
        );
      }

      if (!TimeValidationUtil.validateFutureTime(data.waktuMulai)) {
        throw new Error("Waktu booking tidak boleh di masa lalu");
      }

      // Check for time conflicts
      const conflicts = await this.cwsRepository.checkTimeConflict(
        data.waktuMulai,
        data.waktuBerakhir,
        id
      );
      if (conflicts.length > 0) {
        throw new Error("CWS sudah dibooking pada waktu tersebut");
      }
    }

    // Validate foreign key if being updated
    if (data.idPenanggungJawab) {
      const userExists = await prisma.users.findUnique({
        where: { id: data.idPenanggungJawab },
      });
      if (!userExists) {
        throw new Error("Penanggung jawab tidak ditemukan");
      }
    }

    const input = this.mapUpdateDTOToInput(data);
    return this.repository.update(id, input);
  }

  // Custom methods
  async getCWSByPenanggungJawab(penanggungJawabId: bigint): Promise<CWS[]> {
    return this.cwsRepository.findByPenanggungJawab(penanggungJawabId);
  }

  async getAvailableTimeSlots(
    date: Date
  ): Promise<{ waktuMulai: Date; waktuBerakhir: Date; display: string; available: boolean }[]> {
    const allSlots = TimeValidationUtil.getTwoHourTimeSlots(date);
    const bookedSlots = await this.cwsRepository.findByTimeRange({
      waktuMulai: {
        gte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0
        ),
        lte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59
        ),
      },
    });

    return allSlots.map((slot) => {
      const isBooked = bookedSlots.some(
        (booking) => booking.waktuMulai.getTime() === slot.waktuMulai.getTime()
      );

      return {
        ...slot,
        display: `${slot.waktuMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${slot.waktuBerakhir.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        available: !isBooked,
      };
    });
  }

  protected mapCreateDTOToInput(dto: CreateCWSDTO): Prisma.CWSCreateInput {
    return {
      waktuMulai: dto.waktuMulai,
      waktuBerakhir: dto.waktuBerakhir,
      jumlahPengguna: dto.jumlahPengguna,
      keterangan: dto.keterangan || null,
      isDone: dto.isDone || false,
      penanggungJawab: {
        connect: {
          id: dto.idPenanggungJawab,
        },
      },
    };
  }

  protected mapUpdateDTOToInput(dto: UpdateCWSDTO): Prisma.CWSUpdateInput {
    const input: Prisma.CWSUpdateInput = {};

    if (dto.waktuMulai !== undefined) input.waktuMulai = dto.waktuMulai;
    if (dto.waktuBerakhir !== undefined)
      input.waktuBerakhir = dto.waktuBerakhir;
    if (dto.jumlahPengguna !== undefined)
      input.jumlahPengguna = dto.jumlahPengguna;
    if (dto.keterangan !== undefined) input.keterangan = dto.keterangan;
    if (dto.isDone !== undefined) input.isDone = dto.isDone;
    if (dto.idPenanggungJawab !== undefined) {
      input.penanggungJawab = {
        connect: {
          id: dto.idPenanggungJawab,
        },
      };
    }

    return input;
  }
}
