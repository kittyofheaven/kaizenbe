import { Prisma, Theater } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams, TimeRangeFilter } from "../types";

export class TheaterRepository extends BaseRepository<
  Theater,
  Prisma.TheaterCreateInput,
  Prisma.TheaterUpdateInput
> {
  constructor() {
    super("theater");
  }

  async findMany(params?: PaginationParams): Promise<Theater[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.theater.findMany({
      skip,
      take,
      ...(orderBy && { orderBy }),
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
      },
    });
  }

  async findById(id: bigint): Promise<Theater | null> {
    return this.db.theater.findUnique({
      where: { id },
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.TheaterCreateInput): Promise<Theater> {
    return this.db.theater.create({
      data,
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
      },
    });
  }

  async update(id: bigint, data: Prisma.TheaterUpdateInput): Promise<Theater> {
    return this.db.theater.update({
      where: { id },
      data,
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
            nomorWa: true,
          },
        },
      },
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.theater.delete({
      where: { id },
    });
  }

  async findByTimeRange(filter: TimeRangeFilter): Promise<Theater[]> {
    return this.db.theater.findMany({
      where: {
        ...(filter.waktuMulai && { waktuMulai: filter.waktuMulai }),
        ...(filter.waktuBerakhir && { waktuBerakhir: filter.waktuBerakhir }),
      },
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
      },
    });
  }

  async findByPenanggungJawab(penanggungJawabId: bigint): Promise<Theater[]> {
    return this.db.theater.findMany({
      where: { idPenanggungJawab: penanggungJawabId },
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
      },
    });
  }

  async checkTimeConflict(
    waktuMulai: Date,
    waktuBerakhir: Date,
    excludeId?: bigint
  ): Promise<Theater[]> {
    return this.db.theater.findMany({
      where: {
        ...(excludeId && { id: { not: excludeId } }),
        OR: [
          {
            waktuMulai: {
              lt: waktuBerakhir,
            },
            waktuBerakhir: {
              gt: waktuMulai,
            },
          },
        ],
      },
    });
  }
}
