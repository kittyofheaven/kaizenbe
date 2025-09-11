import { Serbaguna, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams, TimeRangeFilter } from "../types";

export class SerbagunaRepository extends BaseRepository<
  Serbaguna,
  Prisma.SerbagunaCreateInput,
  Prisma.SerbagunaUpdateInput
> {
  constructor() {
    super("serbaguna");
  }

  async findMany(params?: PaginationParams): Promise<Serbaguna[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.serbaguna.findMany({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async findById(id: bigint): Promise<Serbaguna | null> {
    return this.db.serbaguna.findUnique({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.SerbagunaCreateInput): Promise<Serbaguna> {
    return this.db.serbaguna.create({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.SerbagunaUpdateInput
  ): Promise<Serbaguna> {
    return this.db.serbaguna.update({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.serbaguna.delete({
      where: { id },
    });
  }

  // Custom methods
  async findByTimeRange(filter: TimeRangeFilter): Promise<Serbaguna[]> {
    return this.db.serbaguna.findMany({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async findByPenanggungJawab(penanggungJawabId: bigint): Promise<Serbaguna[]> {
    return this.db.serbaguna.findMany({
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
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  async findByArea(areaId: bigint): Promise<Serbaguna[]> {
    return this.db.serbaguna.findMany({
      where: { idArea: areaId },
      include: {
        penanggungJawab: {
          select: {
            id: true,
            namaLengkap: true,
            namaPanggilan: true,
          },
        },
        area: {
          select: {
            id: true,
            namaArea: true,
          },
        },
      },
    });
  }

  // Check for time conflicts in the same area
  async checkTimeConflict(
    waktuMulai: Date,
    waktuBerakhir: Date,
    areaId: bigint,
    excludeId?: bigint
  ): Promise<Serbaguna[]> {
    return this.db.serbaguna.findMany({
      where: {
        idArea: areaId,
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
