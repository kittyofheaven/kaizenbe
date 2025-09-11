import { MesinCuciCowo, Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "../types";

export class MesinCuciCowoRepository extends BaseRepository<
  MesinCuciCowo,
  Prisma.MesinCuciCowoCreateInput,
  Prisma.MesinCuciCowoUpdateInput
> {
  constructor() {
    super("mesinCuciCowo");
  }

  async findMany(params?: PaginationParams): Promise<MesinCuciCowo[]> {
    return this.findAll(params || {});
  }

  async create(data: Prisma.MesinCuciCowoCreateInput): Promise<MesinCuciCowo> {
    return this.db.mesinCuciCowo.create({ data });
  }

  async update(
    id: bigint,
    data: Prisma.MesinCuciCowoUpdateInput
  ): Promise<MesinCuciCowo> {
    return this.db.mesinCuciCowo.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.mesinCuciCowo.delete({
      where: { id },
    });
  }

  async findAll(params: PaginationParams): Promise<MesinCuciCowo[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.mesinCuciCowo.findMany({
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

  async findById(id: bigint): Promise<MesinCuciCowo | null> {
    return this.db.mesinCuciCowo.findUnique({
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

  async findByPeminjam(idPeminjam: bigint): Promise<MesinCuciCowo[]> {
    return this.db.mesinCuciCowo.findMany({
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

  async findByFasilitas(idFasilitas: bigint): Promise<MesinCuciCowo[]> {
    return this.db.mesinCuciCowo.findMany({
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
  ): Promise<MesinCuciCowo[]> {
    return this.db.mesinCuciCowo.findMany({
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
  ): Promise<MesinCuciCowo[]> {
    return this.db.mesinCuciCowo.findMany({
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
