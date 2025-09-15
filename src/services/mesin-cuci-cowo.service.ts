import { MesinCuciCowo, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { MesinCuciCowoRepository } from "../repositories/mesin-cuci-cowo.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateMesinCuciCowoDTO {
  idFasilitas: bigint;
  idPeminjam: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
}

export interface UpdateMesinCuciCowoDTO {
  idFasilitas?: bigint;
  idPeminjam?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
}

export class MesinCuciCowoService extends BaseService<
  MesinCuciCowo,
  CreateMesinCuciCowoDTO,
  UpdateMesinCuciCowoDTO,
  Prisma.MesinCuciCowoCreateInput,
  Prisma.MesinCuciCowoUpdateInput
> {
  private mesinCuciCowoRepository: MesinCuciCowoRepository;

  constructor() {
    const repository = new MesinCuciCowoRepository();
    super(repository);
    this.mesinCuciCowoRepository = repository;
  }

  protected mapCreateDTOToInput(
    dto: CreateMesinCuciCowoDTO
  ): Prisma.MesinCuciCowoCreateInput {
    return {
      waktuMulai: dto.waktuMulai,
      waktuBerakhir: dto.waktuBerakhir,
      fasilitas: {
        connect: { id: dto.idFasilitas },
      },
      peminjam: {
        connect: { id: dto.idPeminjam },
      },
    };
  }

  protected mapUpdateDTOToInput(
    dto: UpdateMesinCuciCowoDTO
  ): Prisma.MesinCuciCowoUpdateInput {
    return {
      ...(dto.waktuMulai && { waktuMulai: dto.waktuMulai }),
      ...(dto.waktuBerakhir && { waktuBerakhir: dto.waktuBerakhir }),
      ...(dto.idFasilitas && {
        fasilitas: { connect: { id: dto.idFasilitas } },
      }),
      ...(dto.idPeminjam && {
        peminjam: { connect: { id: dto.idPeminjam } },
      }),
    };
  }

  async create(data: CreateMesinCuciCowoDTO): Promise<MesinCuciCowo> {
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

    // Validate foreign keys
    await this.validateForeignKeys(data.idPeminjam, data.idFasilitas);

    // Check for conflicting bookings
    const conflicts =
      await this.mesinCuciCowoRepository.findConflictingBookings(
        data.idFasilitas,
        data.waktuMulai,
        data.waktuBerakhir
      );

    if (conflicts.length > 0) {
      throw new Error(
        "Mesin cuci sudah dibooking pada waktu tersebut. Pilih waktu lain."
      );
    }

    const createInput: Prisma.MesinCuciCowoCreateInput = {
      waktuMulai: data.waktuMulai,
      waktuBerakhir: data.waktuBerakhir,
      fasilitas: {
        connect: { id: data.idFasilitas },
      },
      peminjam: {
        connect: { id: data.idPeminjam },
      },
    };

    return this.repository.create(createInput);
  }

  async update(
    id: bigint,
    data: UpdateMesinCuciCowoDTO
  ): Promise<MesinCuciCowo> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Booking mesin cuci tidak ditemukan");
    }

    // If time is being updated, validate it
    if (data.waktuMulai || data.waktuBerakhir) {
      const newWaktuMulai = data.waktuMulai || existing.waktuMulai;
      const newWaktuBerakhir = data.waktuBerakhir || existing.waktuBerakhir;

      if (
        !TimeValidationUtil.validateOneHourSlot(newWaktuMulai, newWaktuBerakhir)
      ) {
        throw new Error(
          "Waktu booking harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
        );
      }

      if (!TimeValidationUtil.validateFutureTime(newWaktuMulai)) {
        throw new Error("Waktu booking tidak boleh di masa lalu");
      }

      // Check for conflicts (excluding current booking)
      const facilityId = data.idFasilitas || existing.idFasilitas;
      const conflicts =
        await this.mesinCuciCowoRepository.findConflictingBookings(
          facilityId,
          newWaktuMulai,
          newWaktuBerakhir,
          id
        );

      if (conflicts.length > 0) {
        throw new Error(
          "Mesin cuci sudah dibooking pada waktu tersebut. Pilih waktu lain."
        );
      }
    }

    // Validate foreign keys if they're being updated
    if (data.idPeminjam || data.idFasilitas) {
      await this.validateForeignKeys(
        data.idPeminjam || existing.idPeminjam,
        data.idFasilitas || existing.idFasilitas
      );
    }

    const updateInput: Prisma.MesinCuciCowoUpdateInput = {
      ...(data.waktuMulai && { waktuMulai: data.waktuMulai }),
      ...(data.waktuBerakhir && { waktuBerakhir: data.waktuBerakhir }),
      ...(data.idFasilitas && {
        fasilitas: { connect: { id: data.idFasilitas } },
      }),
      ...(data.idPeminjam && {
        peminjam: { connect: { id: data.idPeminjam } },
      }),
    };

    return this.repository.update(id, updateInput);
  }

  private async validateForeignKeys(
    idPeminjam: bigint,
    idFasilitas: bigint
  ): Promise<void> {
    // Check if peminjam exists
    const peminjam = await prisma.users.findUnique({
      where: { id: idPeminjam },
    });
    if (!peminjam) {
      throw new Error("Peminjam tidak ditemukan");
    }

    // Check if fasilitas exists
    const fasilitas = await prisma.fasilitasMcCowo.findUnique({
      where: { id: idFasilitas },
    });
    if (!fasilitas) {
      throw new Error("Fasilitas mesin cuci cowo tidak ditemukan");
    }
  }

  // Custom methods
  async getMesinCuciByPeminjam(idPeminjam: bigint): Promise<MesinCuciCowo[]> {
    return this.mesinCuciCowoRepository.findByPeminjam(idPeminjam);
  }

  async getMesinCuciByFasilitas(idFasilitas: bigint): Promise<MesinCuciCowo[]> {
    return this.mesinCuciCowoRepository.findByFasilitas(idFasilitas);
  }

  async getMesinCuciByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<MesinCuciCowo[]> {
    return this.mesinCuciCowoRepository.findByTimeRange(startTime, endTime);
  }

  async getAvailableFacilities(): Promise<any[]> {
    const facilities = await prisma.fasilitasMcCowo.findMany({
      select: {
        id: true,
        nama: true,
      },
    });

    return facilities.map((facility) => ({
      ...facility,
      id: facility.id.toString(),
    }));
  }

  async getAvailableTimeSlots(
    date: string,
    facilityId?: bigint
  ): Promise<
    {
      waktuMulai: Date;
      waktuBerakhir: Date;
      display: string;
      available: boolean;
    }[]
  > {
    const dateObj = new Date(date);
    const allSlots = TimeValidationUtil.getOneHourTimeSlots(dateObj);

    // Get all bookings for the specified date
    const startTime = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      0,
      0,
      0
    );
    const endTime = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      23,
      59,
      59
    );
    const bookedSlots = await this.mesinCuciCowoRepository.findByTimeRange(
      startTime,
      endTime
    );

    return allSlots.map((slot) => {
      const isBooked = bookedSlots.some((booking) => {
        // If facilityId is provided, check for that specific facility
        if (facilityId) {
          return (
            booking.idFasilitas === facilityId &&
            booking.waktuMulai.getTime() === slot.waktuMulai.getTime()
          );
        }
        // If no facilityId provided, check if any facility is booked at this time
        return booking.waktuMulai.getTime() === slot.waktuMulai.getTime();
      });

      return {
        ...slot,
        display: `${slot.waktuMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} - ${slot.waktuBerakhir.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })}`,
        available: !isBooked,
      };
    });
  }
}
