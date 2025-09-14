import { Serbaguna, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { SerbagunaRepository } from "../repositories/serbaguna.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateSerbagunaDTO {
  idPenanggungJawab: bigint;
  idArea: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
  jumlahPengguna: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export interface UpdateSerbagunaDTO {
  idPenanggungJawab?: bigint;
  idArea?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
  jumlahPengguna?: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export class SerbagunaService extends BaseService<
  Serbaguna,
  CreateSerbagunaDTO,
  UpdateSerbagunaDTO,
  Prisma.SerbagunaCreateInput,
  Prisma.SerbagunaUpdateInput
> {
  private serbagunaRepository: SerbagunaRepository;

  constructor() {
    const repository = new SerbagunaRepository();
    super(repository);
    this.serbagunaRepository = repository;
  }

  async create(data: CreateSerbagunaDTO): Promise<Serbaguna> {
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

    // Validate foreign key - check if area exists
    const areaExists = await prisma.areaSerbaguna.findUnique({
      where: { id: data.idArea },
    });
    if (!areaExists) {
      throw new Error("Area serbaguna tidak ditemukan");
    }

    // Check for time conflicts in the same area
    const conflicts = await this.serbagunaRepository.checkTimeConflict(
      data.waktuMulai,
      data.waktuBerakhir,
      data.idArea
    );
    if (conflicts.length > 0) {
      throw new Error(`Area serbaguna sudah dibooking pada waktu tersebut`);
    }

    const input = this.mapCreateDTOToInput(data);
    return this.repository.create(input);
  }

  async update(id: bigint, data: UpdateSerbagunaDTO): Promise<Serbaguna> {
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
      const conflicts = await this.serbagunaRepository.checkTimeConflict(
        data.waktuMulai,
        data.waktuBerakhir,
        data.idArea || existing.idArea,
        id
      );
      if (conflicts.length > 0) {
        throw new Error("Area serbaguna sudah dibooking pada waktu tersebut");
      }
    }

    // Validate foreign keys if being updated
    if (data.idPenanggungJawab) {
      const userExists = await prisma.users.findUnique({
        where: { id: data.idPenanggungJawab },
      });
      if (!userExists) {
        throw new Error("Penanggung jawab tidak ditemukan");
      }
    }

    if (data.idArea) {
      const areaExists = await prisma.areaSerbaguna.findUnique({
        where: { id: data.idArea },
      });
      if (!areaExists) {
        throw new Error("Area serbaguna tidak ditemukan");
      }
    }

    const input = this.mapUpdateDTOToInput(data);
    return this.repository.update(id, input);
  }

  // Custom methods
  async getSerbagunaByPenanggungJawab(
    penanggungJawabId: bigint
  ): Promise<Serbaguna[]> {
    return this.serbagunaRepository.findByPenanggungJawab(penanggungJawabId);
  }

  async getSerbagunaByArea(areaId: bigint): Promise<Serbaguna[]> {
    return this.serbagunaRepository.findByArea(areaId);
  }

  async getAvailableTimeSlots(
    date: Date,
    areaId: bigint
  ): Promise<{ waktuMulai: Date; waktuBerakhir: Date; display: string; available: boolean }[]> {
    const allSlots = TimeValidationUtil.getOneHourTimeSlots(date);
    const bookedSlots = await this.serbagunaRepository.findByTimeRange({
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
          booking.idArea === areaId &&
          booking.waktuMulai.getTime() === slot.waktuMulai.getTime()
      );

      return {
        ...slot,
        display: `${slot.waktuMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${slot.waktuBerakhir.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        available: !isBooked,
      };
    });
  }

  async getAvailableAreas(): Promise<any[]> {
    const areas = await prisma.areaSerbaguna.findMany({
      select: {
        id: true,
        namaArea: true,
      },
    });

    // Convert BigInt to string for JSON serialization
    return areas.map((area) => ({
      ...area,
      id: area.id.toString(),
    }));
  }

  protected mapCreateDTOToInput(
    dto: CreateSerbagunaDTO
  ): Prisma.SerbagunaCreateInput {
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
      area: {
        connect: {
          id: dto.idArea,
        },
      },
    };
  }

  protected mapUpdateDTOToInput(
    dto: UpdateSerbagunaDTO
  ): Prisma.SerbagunaUpdateInput {
    const input: Prisma.SerbagunaUpdateInput = {};

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
    if (dto.idArea !== undefined) {
      input.area = {
        connect: {
          id: dto.idArea,
        },
      };
    }

    return input;
  }
}
