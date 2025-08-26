import { PrismaClient } from "@prisma/client";
import { prisma } from "../utils/database";
import { IRepository, PaginationParams } from "../types";

export abstract class BaseRepository<T, CreateInput, UpdateInput>
  implements IRepository<T, CreateInput, UpdateInput>
{
  protected db: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.db = prisma;
    this.modelName = modelName;
  }

  abstract findMany(params?: any): Promise<T[]>;
  abstract findById(id: bigint): Promise<T | null>;
  abstract create(data: CreateInput): Promise<T>;
  abstract update(id: bigint, data: UpdateInput): Promise<T>;
  abstract delete(id: bigint): Promise<void>;

  // Helper method for pagination
  protected getPaginationParams(params?: PaginationParams) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  // Helper method for sorting
  protected getSortParams(params?: PaginationParams) {
    if (!params?.sortBy) return undefined;

    return {
      [params.sortBy]: params.sortOrder || "asc",
    };
  }
}
