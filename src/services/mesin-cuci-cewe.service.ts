import { MesinCuciCewe, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { MesinCuciCeweRepository } from "../repositories/mesin-cuci-cewe.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateMesinCuciCeweDTO {
  idFasilitas: bigint;
  idPeminjam: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
}

export interface UpdateMesinCuciCeweDTO {
  idFasilitas?: bigint;
  idPeminjam?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
}

export class MesinCuciCeweService extends BaseService<
  MesinCuciCewe,
  CreateMesinCuciCeweDTO,
  UpdateMesinCuciCeweDTO,
  Prisma.MesinCuciCeweCreateInput,
  Prisma.MesinCuciCeweUpdateInput
> {
  private mesinCuciCeweRepository: MesinCuciCeweRepository;

  constructor() {
    const repository = new MesinCuciCeweRepository();
    super(repository);
    this.mesinCuciCeweRepository = repository;
  }

  protected mapCreateDTOToInput(
    dto: CreateMesinCuciCeweDTO
  ): Prisma.MesinCuciCeweCreateInput {
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
    dto: UpdateMesinCuciCeweDTO
  ): Prisma.MesinCuciCeweUpdateInput {
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

  async create(data: CreateMesinCuciCeweDTO): Promise<MesinCuciCewe> {
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
      await this.mesinCuciCeweRepository.findConflictingBookings(
        data.idFasilitas,
        data.waktuMulai,
        data.waktuBerakhir
      );

    if (conflicts.length > 0) {
      throw new Error(
        "Mesin cuci sudah dibooking pada waktu tersebut. Pilih waktu lain."
      );
    }

    const createInput: Prisma.MesinCuciCeweCreateInput = {
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
    data: UpdateMesinCuciCeweDTO
  ): Promise<MesinCuciCewe> {
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
        await this.mesinCuciCeweRepository.findConflictingBookings(
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

    const updateInput: Prisma.MesinCuciCeweUpdateInput = {
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
    const fasilitas = await prisma.fasilitasMcCewe.findUnique({
      where: { id: idFasilitas },
    });
    if (!fasilitas) {
      throw new Error("Fasilitas mesin cuci cewe tidak ditemukan");
    }
  }

  // Custom methods
  async getMesinCuciByPeminjam(idPeminjam: bigint): Promise<MesinCuciCewe[]> {
    return this.mesinCuciCeweRepository.findByPeminjam(idPeminjam);
  }

  async getMesinCuciByFasilitas(idFasilitas: bigint): Promise<MesinCuciCewe[]> {
    return this.mesinCuciCeweRepository.findByFasilitas(idFasilitas);
  }

  async getMesinCuciByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<MesinCuciCewe[]> {
    return this.mesinCuciCeweRepository.findByTimeRange(startTime, endTime);
  }

  async getAvailableFacilities(): Promise<any[]> {
    const facilities = await prisma.fasilitasMcCewe.findMany({
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
  ): Promise<any[]> {
    const dateObj = new Date(date);
    return TimeValidationUtil.getOneHourTimeSlots(dateObj);
  }
}
