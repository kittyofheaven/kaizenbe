import { Dapur, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { DapurRepository } from "../repositories/dapur.repository";
import { TimeValidationUtil } from "../utils/time-validation";
import { prisma } from "../utils/database";

// DTOs
export interface CreateDapurDTO {
  idFasilitas: bigint;
  idPeminjam: bigint;
  waktuMulai: Date;
  waktuBerakhir: Date;
  pinjamPeralatan: boolean;
}

export interface UpdateDapurDTO {
  idFasilitas?: bigint;
  idPeminjam?: bigint;
  waktuMulai?: Date;
  waktuBerakhir?: Date;
  pinjamPeralatan?: boolean;
}

export class DapurService extends BaseService<
  Dapur,
  CreateDapurDTO,
  UpdateDapurDTO,
  Prisma.DapurCreateInput,
  Prisma.DapurUpdateInput
> {
  private dapurRepository: DapurRepository;

  constructor() {
    const repository = new DapurRepository();
    super(repository);
    this.dapurRepository = repository;
  }

  protected mapCreateDTOToInput(dto: CreateDapurDTO): Prisma.DapurCreateInput {
    return {
      waktuMulai: dto.waktuMulai,
      waktuBerakhir: dto.waktuBerakhir,
      pinjamPeralatan: dto.pinjamPeralatan,
      fasilitas: {
        connect: { id: dto.idFasilitas },
      },
      peminjam: {
        connect: { id: dto.idPeminjam },
      },
    };
  }

  protected mapUpdateDTOToInput(dto: UpdateDapurDTO): Prisma.DapurUpdateInput {
    return {
      ...(dto.waktuMulai && { waktuMulai: dto.waktuMulai }),
      ...(dto.waktuBerakhir && { waktuBerakhir: dto.waktuBerakhir }),
      ...(dto.pinjamPeralatan !== undefined && {
        pinjamPeralatan: dto.pinjamPeralatan,
      }),
      ...(dto.idFasilitas && {
        fasilitas: { connect: { id: dto.idFasilitas } },
      }),
      ...(dto.idPeminjam && {
        peminjam: { connect: { id: dto.idPeminjam } },
      }),
    };
  }

  async create(data: CreateDapurDTO): Promise<Dapur> {
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
    const conflicts = await this.dapurRepository.findConflictingBookings(
      data.idFasilitas,
      data.waktuMulai,
      data.waktuBerakhir
    );

    if (conflicts.length > 0) {
      throw new Error(
        "Dapur sudah dibooking pada waktu tersebut. Pilih waktu lain."
      );
    }

    const createInput: Prisma.DapurCreateInput = {
      waktuMulai: data.waktuMulai,
      waktuBerakhir: data.waktuBerakhir,
      pinjamPeralatan: data.pinjamPeralatan,
      fasilitas: {
        connect: { id: data.idFasilitas },
      },
      peminjam: {
        connect: { id: data.idPeminjam },
      },
    };

    return this.repository.create(createInput);
  }

  async update(id: bigint, data: UpdateDapurDTO): Promise<Dapur> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Booking dapur tidak ditemukan");
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
      const conflicts = await this.dapurRepository.findConflictingBookings(
        facilityId,
        newWaktuMulai,
        newWaktuBerakhir,
        id
      );

      if (conflicts.length > 0) {
        throw new Error(
          "Dapur sudah dibooking pada waktu tersebut. Pilih waktu lain."
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

    const updateInput: Prisma.DapurUpdateInput = {
      ...(data.waktuMulai && { waktuMulai: data.waktuMulai }),
      ...(data.waktuBerakhir && { waktuBerakhir: data.waktuBerakhir }),
      ...(data.pinjamPeralatan !== undefined && {
        pinjamPeralatan: data.pinjamPeralatan,
      }),
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
    const fasilitas = await prisma.fasilitasDapur.findUnique({
      where: { id: idFasilitas },
    });
    if (!fasilitas) {
      throw new Error("Fasilitas dapur tidak ditemukan");
    }
  }

  // Custom methods
  async getDapurByPeminjam(idPeminjam: bigint): Promise<Dapur[]> {
    return this.dapurRepository.findByPeminjam(idPeminjam);
  }

  async getDapurByFasilitas(idFasilitas: bigint): Promise<Dapur[]> {
    return this.dapurRepository.findByFasilitas(idFasilitas);
  }

  async getDapurByTimeRange(startTime: Date, endTime: Date): Promise<Dapur[]> {
    return this.dapurRepository.findByTimeRange(startTime, endTime);
  }

  async getAvailableFacilities(): Promise<any[]> {
    const facilities = await prisma.fasilitasDapur.findMany({
      select: {
        id: true,
        fasilitas: true,
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


