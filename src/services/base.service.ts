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
    const [data, total] = await Promise.all([
      this.repository.findMany(params),
      this.repository.count(params),
    ]);

    const limit = params?.limit || 10;
    const currentPage = params?.page || 1;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages,
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
