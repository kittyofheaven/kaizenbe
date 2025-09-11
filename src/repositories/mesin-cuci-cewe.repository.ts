import { MesinCuciCewe, Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "../types";

export class MesinCuciCeweRepository extends BaseRepository<
  MesinCuciCewe,
  Prisma.MesinCuciCeweCreateInput,
  Prisma.MesinCuciCeweUpdateInput
> {
  constructor() {
    super("mesinCuciCewe");
  }

  async findMany(params?: PaginationParams): Promise<MesinCuciCewe[]> {
    return this.findAll(params || {});
  }

  async create(data: Prisma.MesinCuciCeweCreateInput): Promise<MesinCuciCewe> {
    return this.db.mesinCuciCewe.create({ data });
  }

  async update(
    id: bigint,
    data: Prisma.MesinCuciCeweUpdateInput
  ): Promise<MesinCuciCewe> {
    return this.db.mesinCuciCewe.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.mesinCuciCewe.delete({
      where: { id },
    });
  }

  async findAll(params: PaginationParams): Promise<MesinCuciCewe[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.mesinCuciCewe.findMany({
      skip,
      take,
      ...(orderBy && { orderBy }),
      include: {
        peminjam: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
        fasilitas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async findById(id: bigint): Promise<MesinCuciCewe | null> {
    return this.db.mesinCuciCewe.findUnique({
      where: { id },
      include: {
        peminjam: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
        fasilitas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async findByPeminjam(idPeminjam: bigint): Promise<MesinCuciCewe[]> {
    return this.db.mesinCuciCewe.findMany({
      where: { idPeminjam },
      include: {
        peminjam: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
        fasilitas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async findByFasilitas(idFasilitas: bigint): Promise<MesinCuciCewe[]> {
    return this.db.mesinCuciCewe.findMany({
      where: { idFasilitas },
      include: {
        peminjam: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
        fasilitas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async findByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<MesinCuciCewe[]> {
    return this.db.mesinCuciCewe.findMany({
      where: {
        waktuMulai: {
          gte: startTime,
          lte: endTime,
        },
      },
      include: {
        peminjam: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
        fasilitas: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async findConflictingBookings(
    idFasilitas: bigint,
    waktuMulai: Date,
    waktuBerakhir: Date,
    excludeId?: bigint
  ): Promise<MesinCuciCewe[]> {
    return this.db.mesinCuciCewe.findMany({
      where: {
        idFasilitas,
        AND: [
          {
            waktuMulai: {
              lt: waktuBerakhir,
            },
          },
          {
            waktuBerakhir: {
              gt: waktuMulai,
            },
          },
        ],
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });
  }
}
