import { Communal, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { CommunalRepository } from "../repositories/communal.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateCommunalDTO {
  idPenanggungJawab: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
  jumlahPengguna: bigint;
  lantai: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export interface UpdateCommunalDTO {
  idPenanggungJawab?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
  jumlahPengguna?: bigint;
  lantai?: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export class CommunalService extends BaseService<
  Communal,
  CreateCommunalDTO,
  UpdateCommunalDTO,
  Prisma.CommunalCreateInput,
  Prisma.CommunalUpdateInput
> {
  private communalRepository: CommunalRepository;

  constructor() {
    const repository = new CommunalRepository();
    super(repository);
    this.communalRepository = repository;
  }

  async create(data: CreateCommunalDTO): Promise<Communal> {
    // Validate time slots (1 hour)
    if (
      !TimeValidationUtil.validateOneHourSlot(
        data.waktuMulai,
        data.waktuBerakhir
      )
    ) {
      throw new Error(
        "Waktu booking harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
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

    // Check for time conflicts on the same floor
    const conflicts = await this.communalRepository.checkTimeConflict(
      data.waktuMulai,
      data.waktuBerakhir,
      data.lantai
    );
    if (conflicts.length > 0) {
      throw new Error(
        `Ruang communal lantai ${data.lantai} sudah dibooking pada waktu tersebut`
      );
    }

    const input = this.mapCreateDTOToInput(data);
    return this.repository.create(input);
  }

  async update(id: bigint, data: UpdateCommunalDTO): Promise<Communal> {
    // Get existing record
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Resource not found");
    }

    // Validate time slots if time is being updated
    if (data.waktuMulai && data.waktuBerakhir) {
      if (
        !TimeValidationUtil.validateOneHourSlot(
          data.waktuMulai,
          data.waktuBerakhir
        )
      ) {
        throw new Error(
          "Waktu booking harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
        );
      }

      if (!TimeValidationUtil.validateFutureTime(data.waktuMulai)) {
        throw new Error("Waktu booking tidak boleh di masa lalu");
      }

      // Check for time conflicts
      const conflicts = await this.communalRepository.checkTimeConflict(
        data.waktuMulai,
        data.waktuBerakhir,
        data.lantai || existing.lantai,
        id
      );
      if (conflicts.length > 0) {
        throw new Error(
          `Ruang communal lantai ${
            data.lantai || existing.lantai
          } sudah dibooking pada waktu tersebut`
        );
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
  async getCommunalByPenanggungJawab(
    penanggungJawabId: bigint
  ): Promise<Communal[]> {
    return this.communalRepository.findByPenanggungJawab(penanggungJawabId);
  }

  async getCommunalByLantai(lantai: bigint): Promise<Communal[]> {
    return this.communalRepository.findByLantai(lantai);
  }

  async getAvailableTimeSlots(
    date: Date,
    lantai: bigint
  ): Promise<{ waktuMulai: Date; waktuBerakhir: Date; display: string; available: boolean }[]> {
    const allSlots = TimeValidationUtil.getOneHourTimeSlots(date);
    const bookedSlots = await this.communalRepository.findByTimeRange({
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
        (booking) =>
          booking.lantai === lantai &&
          booking.waktuMulai.getTime() === slot.waktuMulai.getTime()
      );

      return {
        ...slot,
        display: `${slot.waktuMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} - ${slot.waktuBerakhir.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })}`,
        available: !isBooked,
      };
    });
  }

  protected mapCreateDTOToInput(
    dto: CreateCommunalDTO
  ): Prisma.CommunalCreateInput {
    return {
      waktuMulai: dto.waktuMulai,
      waktuBerakhir: dto.waktuBerakhir,
      jumlahPengguna: dto.jumlahPengguna,
      lantai: dto.lantai,
      keterangan: dto.keterangan || null,
      isDone: dto.isDone || false,
      penanggungJawab: {
        connect: {
          id: dto.idPenanggungJawab,
        },
      },
    };
  }

  protected mapUpdateDTOToInput(
    dto: UpdateCommunalDTO
  ): Prisma.CommunalUpdateInput {
    const input: Prisma.CommunalUpdateInput = {};

    if (dto.waktuMulai !== undefined) input.waktuMulai = dto.waktuMulai;
    if (dto.waktuBerakhir !== undefined)
      input.waktuBerakhir = dto.waktuBerakhir;
    if (dto.jumlahPengguna !== undefined)
      input.jumlahPengguna = dto.jumlahPengguna;
    if (dto.lantai !== undefined) input.lantai = dto.lantai;
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
