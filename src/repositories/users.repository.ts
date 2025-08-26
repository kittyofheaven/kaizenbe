import { Users, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationParams } from "../types";

export class UsersRepository extends BaseRepository<
  Users,
  Prisma.UsersCreateInput,
  Prisma.UsersUpdateInput
> {
  constructor() {
    super("users");
  }

  async findMany(params?: PaginationParams): Promise<Users[]> {
    const { skip, take } = this.getPaginationParams(params);
    const orderBy = this.getSortParams(params);

    return this.db.users.findMany({
      skip,
      take,
      ...(orderBy && { orderBy }),
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }

  async findById(id: bigint): Promise<Users | null> {
    return this.db.users.findUnique({
      where: { id },
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.db.users.create({
      data,
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }

  async update(id: bigint, data: Prisma.UsersUpdateInput): Promise<Users> {
    return this.db.users.update({
      where: { id },
      data,
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.db.users.delete({
      where: { id },
    });
  }

  // Custom methods
  async findByAngkatan(angkatanId: bigint): Promise<Users[]> {
    return this.db.users.findMany({
      where: {
        idAngkatan: angkatanId,
      },
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }

  async findByNomorWa(nomorWa: string): Promise<Users | null> {
    return this.db.users.findFirst({
      where: {
        nomorWa,
      },
      include: {
        angkatan: {
          select: {
            id: true,
            namaAngkatan: true,
          },
        },
      },
    });
  }
}
