import { Communal, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams, TimeRangeFilter } from "../types";

export class CommunalRepository extends BaseRepository<
  Communal,
  Prisma.CommunalCreateInput,
  Prisma.CommunalUpdateInput
> {
  constructor() {
    super("communal");
  }

  async findMany(params?: PaginationParams): Promise<Communal[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.communal.findMany({
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

  async findById(id: bigint): Promise<Communal | null> {
    return this.db.communal.findUnique({
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

  async create(data: Prisma.CommunalCreateInput): Promise<Communal> {
    return this.db.communal.create({
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

  async update(
    id: bigint,
    data: Prisma.CommunalUpdateInput
  ): Promise<Communal> {
    return this.db.communal.update({
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
    await this.db.communal.delete({
      where: { id },
    });
  }

  // Custom methods
  async findByTimeRange(filter: TimeRangeFilter): Promise<Communal[]> {
    return this.db.communal.findMany({
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

  async findByPenanggungJawab(penanggungJawabId: bigint): Promise<Communal[]> {
    return this.db.communal.findMany({
      where: {
        idPenanggungJawab: penanggungJawabId,
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

  async findByLantai(lantai: bigint): Promise<Communal[]> {
    return this.db.communal.findMany({
      where: { lantai },
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

  // Check for time conflicts
  async checkTimeConflict(
    waktuMulai: Date,
    waktuBerakhir: Date,
    lantai: bigint,
    excludeId?: bigint
  ): Promise<Communal[]> {
    return this.db.communal.findMany({
      where: {
        lantai,
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
