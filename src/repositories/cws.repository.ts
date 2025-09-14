import { CWS, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams, TimeRangeFilter } from "../types";

export class CWSRepository extends BaseRepository<
  CWS,
  Prisma.CWSCreateInput,
  Prisma.CWSUpdateInput
> {
  constructor() {
    super("cWS");
  }

  async findMany(params?: PaginationParams): Promise<CWS[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.cws.findMany({
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

  async findById(id: bigint): Promise<CWS | null> {
    return this.db.cws.findUnique({
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

  async create(data: Prisma.CWSCreateInput): Promise<CWS> {
    return this.db.cws.create({
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

  async update(id: bigint, data: Prisma.CWSUpdateInput): Promise<CWS> {
    return this.db.cws.update({
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
    await this.db.cws.delete({
      where: { id },
    });
  }

  // Custom methods
  async findByTimeRange(filter: TimeRangeFilter): Promise<CWS[]> {
    return this.db.cws.findMany({
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

  async findByPenanggungJawab(penanggungJawabId: bigint): Promise<CWS[]> {
    return this.db.cws.findMany({
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

  // Check for time conflicts (CWS is unique facility)
  async checkTimeConflict(
    waktuMulai: Date,
    waktuBerakhir: Date,
    excludeId?: bigint
  ): Promise<CWS[]> {
    return this.db.cws.findMany({
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
