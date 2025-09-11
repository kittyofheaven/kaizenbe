import { Dapur, Prisma, PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "../types";

export class DapurRepository extends BaseRepository<
  Dapur,
  Prisma.DapurCreateInput,
  Prisma.DapurUpdateInput
> {
  constructor() {
    super("dapur");
  }

  async findMany(params?: PaginationParams): Promise<Dapur[]> {
    return this.findAll(params || {});
  }

  async create(data: Prisma.DapurCreateInput): Promise<Dapur> {
    return this.db.dapur.create({ data });
  }

  async update(id: bigint, data: Prisma.DapurUpdateInput): Promise<Dapur> {
    return this.db.dapur.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.dapur.delete({
      where: { id },
    });
  }

  async findAll(params: PaginationParams): Promise<Dapur[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.dapur.findMany({
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
            fasilitas: true,
          },
        },
      },
    });
  }

  async findById(id: bigint): Promise<Dapur | null> {
    return this.db.dapur.findUnique({
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
            fasilitas: true,
          },
        },
      },
    });
  }

  async findByPeminjam(idPeminjam: bigint): Promise<Dapur[]> {
    return this.db.dapur.findMany({
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
            fasilitas: true,
          },
        },
      },
    });
  }

  async findByFasilitas(idFasilitas: bigint): Promise<Dapur[]> {
    return this.db.dapur.findMany({
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
            fasilitas: true,
          },
        },
      },
    });
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Dapur[]> {
    return this.db.dapur.findMany({
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
            fasilitas: true,
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
  ): Promise<Dapur[]> {
    return this.db.dapur.findMany({
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


