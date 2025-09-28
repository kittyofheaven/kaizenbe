import { Prisma, Theater } from "@prisma/client";
import { BaseService } from "./base.service";
import { TheaterRepository } from "../repositories/theater.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

export interface CreateTheaterDTO {
  idPenanggungJawab: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
  jumlahPengguna: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export interface UpdateTheaterDTO {
  idPenanggungJawab?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
  jumlahPengguna?: bigint;
  keterangan?: string;
  isDone?: boolean;
}

export class TheaterService extends BaseService<
  Theater,
  CreateTheaterDTO,
  UpdateTheaterDTO,
  Prisma.TheaterCreateInput,
  Prisma.TheaterUpdateInput
> {
  private theaterRepository: TheaterRepository;

  constructor() {
    const repository = new TheaterRepository();
    super(repository);
    this.theaterRepository = repository;
  }

  async create(data: CreateTheaterDTO): Promise<Theater> {
    if (
      !TimeValidationUtil.validateOneHourSlot(
        data.waktuMulai,
        data.waktuBerakhir
      )
    ) {
      throw new Error(
        "Waktu booking theater harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
      );
    }

    if (!TimeValidationUtil.validateFutureTime(data.waktuMulai)) {
      throw new Error("Waktu booking tidak boleh di masa lalu");
    }

    const userExists = await prisma.users.findUnique({
      where: { id: data.idPenanggungJawab },
    });
    if (!userExists) {
      throw new Error("Penanggung jawab tidak ditemukan");
    }

    const conflicts = await this.theaterRepository.checkTimeConflict(
      data.waktuMulai,
      data.waktuBerakhir
    );
    if (conflicts.length > 0) {
      throw new Error("Theater sudah dibooking pada waktu tersebut");
    }

    const input = this.mapCreateDTOToInput(data);
    return this.repository.create(input);
  }

  async update(id: bigint, data: UpdateTheaterDTO): Promise<Theater> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Resource not found");
    }

    const newWaktuMulai = data.waktuMulai ?? existing.waktuMulai;
    const newWaktuBerakhir = data.waktuBerakhir ?? existing.waktuBerakhir;

    if (data.waktuMulai !== undefined || data.waktuBerakhir !== undefined) {
      if (
        !TimeValidationUtil.validateOneHourSlot(
          newWaktuMulai,
          newWaktuBerakhir
        )
      ) {
        throw new Error(
          "Waktu booking theater harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
        );
      }

      if (!TimeValidationUtil.validateFutureTime(newWaktuMulai)) {
        throw new Error("Waktu booking tidak boleh di masa lalu");
      }

      const conflicts = await this.theaterRepository.checkTimeConflict(
        newWaktuMulai,
        newWaktuBerakhir,
        id
      );
      if (conflicts.length > 0) {
        throw new Error("Theater sudah dibooking pada waktu tersebut");
      }
    }

    if (data.idPenanggungJawab !== undefined) {
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

  async getTheaterByPenanggungJawab(
    penanggungJawabId: bigint
  ): Promise<Theater[]> {
    return this.theaterRepository.findByPenanggungJawab(penanggungJawabId);
  }

  async getAvailableTimeSlots(
    date: Date
  ): Promise<
    {
      waktuMulai: Date;
      waktuBerakhir: Date;
      display: string;
      available: boolean;
    }[]
  > {
    const allSlots = TimeValidationUtil.getOneHourTimeSlots(date);

    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    const bookedSlots = await this.theaterRepository.findByTimeRange({
      waktuMulai: { gte: startOfDay, lte: endOfDay },
    });

    return allSlots.map((slot) => {
      const isBooked = bookedSlots.some(
        (booking) => booking.waktuMulai.getTime() === slot.waktuMulai.getTime()
      );

      return {
        ...slot,
        display: TimeValidationUtil.formatTimeSlot(
          slot.waktuMulai,
          slot.waktuBerakhir
        ),
        available: !isBooked,
      };
    });
  }

  protected mapCreateDTOToInput(
    dto: CreateTheaterDTO
  ): Prisma.TheaterCreateInput {
    return {
      waktuMulai: dto.waktuMulai,
      waktuBerakhir: dto.waktuBerakhir,
      jumlahPengguna: dto.jumlahPengguna,
      keterangan: dto.keterangan ?? null,
      isDone: dto.isDone ?? false,
      penanggungJawab: {
        connect: {
          id: dto.idPenanggungJawab,
        },
      },
    };
  }

  protected mapUpdateDTOToInput(
    dto: UpdateTheaterDTO
  ): Prisma.TheaterUpdateInput {
    const input: Prisma.TheaterUpdateInput = {};

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
