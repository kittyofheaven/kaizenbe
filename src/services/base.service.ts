import { IService, PaginationParams, PaginatedResponse } from "../types";
import { BaseRepository } from "../repositories/base.repository";

export abstract class BaseService<
  T,
  CreateDTO,
  UpdateDTO,
  CreateInput,
  UpdateInput
> implements IService<T, CreateDTO, UpdateDTO>
{
  protected repository: BaseRepository<T, CreateInput, UpdateInput>;

  constructor(repository: BaseRepository<T, CreateInput, UpdateInput>) {
    this.repository = repository;
  }

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const data = await this.repository.findMany(params);
    // This is a simplified pagination - in real implementation,
    // you'd want to get the total count as well
    return {
      data,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: data.length, // This should be actual total from DB
        totalPages: Math.ceil(data.length / (params?.limit || 10)),
      },
    };
  }

  async getById(id: bigint): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error("Resource not found");
    }
    return item;
  }

  abstract create(data: CreateDTO): Promise<T>;
  abstract update(id: bigint, data: UpdateDTO): Promise<T>;

  async delete(id: bigint): Promise<void> {
    await this.getById(id); // Check if exists
    await this.repository.delete(id);
  }

  // Helper method to transform DTO to repository input
  protected abstract mapCreateDTOToInput(dto: CreateDTO): CreateInput;
  protected abstract mapUpdateDTOToInput(dto: UpdateDTO): UpdateInput;
}
