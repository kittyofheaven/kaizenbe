import { CWS, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import {
  CWSRepository,
  CWSWithRelations,
} from "../repositories/cws.repository";
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

    // Validate Thursday restriction
    const bookingDate = new Date(data.waktuMulai);
    const dayOfWeek = bookingDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday
    if (dayOfWeek === 4) {
      throw new Error(
        "CWS tidak bisa di book pada hari Kamis karena public only"
      );
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

    const newWaktuMulai = data.waktuMulai ?? existing.waktuMulai;
    const newWaktuBerakhir = data.waktuBerakhir ?? existing.waktuBerakhir;

    // Validate time slots if either boundary is being updated
    if (data.waktuMulai !== undefined || data.waktuBerakhir !== undefined) {
      if (
        !TimeValidationUtil.validateTwoHourSlot(
          newWaktuMulai,
          newWaktuBerakhir
        )
      ) {
        throw new Error(
          "Waktu booking CWS harus dalam slot 2 jam penuh (contoh: 13:00-15:00)"
        );
      }

      if (!TimeValidationUtil.validateFutureTime(newWaktuMulai)) {
        throw new Error("Waktu booking tidak boleh di masa lalu");
      }

      const bookingDate = new Date(newWaktuMulai);
      if (bookingDate.getDay() === 4) {
        throw new Error(
          "CWS tidak bisa di book pada hari Kamis karena public only"
        );
      }

      // Check for time conflicts
      const conflicts = await this.cwsRepository.checkTimeConflict(
        newWaktuMulai,
        newWaktuBerakhir,
        id
      );
      if (conflicts.length > 0) {
        throw new Error("CWS sudah dibooking pada waktu tersebut");
      }
    }

    // Validate foreign key if being updated
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

  // Custom methods
  async getCWSByPenanggungJawab(penanggungJawabId: bigint): Promise<CWS[]> {
    return this.cwsRepository.findByPenanggungJawab(penanggungJawabId);
  }

  async getAvailableTimeSlots(date: Date): Promise<
    {
      waktuMulai: Date;
      waktuBerakhir: Date;
      display: string;
      available: boolean;
    }[]
  > {
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
        display: `${slot.waktuMulai.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta", // WIB (UTC+7)
        })} - ${slot.waktuBerakhir.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta", // WIB (UTC+7)
        })}`,
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

  async getBookingsByDate(date: string): Promise<CWSWithRelations[]> {
    const dateObj = new Date(date);
    const startOfDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      23,
      59,
      59
    );

    return this.cwsRepository.findByDateRange(startOfDay, endOfDay);
  }

  async markPastBookingsAsDone(): Promise<void> {
    const now = new Date();

    // Find all bookings that have ended but are not marked as done
    const pastBookings = await this.cwsRepository.findByTimeRange({
      waktuBerakhir: {
        lte: now,
      },
    });

    // Filter only bookings that are not done yet
    const undoneBookings = pastBookings.filter((booking) => !booking.isDone);

    // Mark all past bookings as done
    for (const booking of undoneBookings) {
      await this.cwsRepository.update(booking.id, { isDone: true });
    }
  }
}
