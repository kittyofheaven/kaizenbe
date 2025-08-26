// Base types and interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query filters for time-based searches
export interface TimeRangeFilter {
  waktuMulai?: {
    gte?: Date;
    lte?: Date;
  };
  waktuBerakhir?: {
    gte?: Date;
    lte?: Date;
  };
}

// Generic repository interface
export interface IRepository<T, CreateInput, UpdateInput> {
  findMany(params?: any): Promise<T[]>;
  findById(id: bigint): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: bigint, data: UpdateInput): Promise<T>;
  delete(id: bigint): Promise<void>;
}

// Generic service interface
export interface IService<T, CreateDTO, UpdateDTO> {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  getById(id: bigint): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: bigint, data: UpdateDTO): Promise<T>;
  delete(id: bigint): Promise<void>;
}
