import { Users, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { UsersRepository } from "../repositories/users.repository";

// DTOs
export interface CreateUserDTO {
  idAngkatan: bigint;
  namaLengkap: string;
  namaPanggilan: string;
  nomorWa?: string;
}

export interface UpdateUserDTO {
  idAngkatan?: bigint;
  namaLengkap?: string;
  namaPanggilan?: string;
  nomorWa?: string;
}

export class UsersService extends BaseService<
  Users,
  CreateUserDTO,
  UpdateUserDTO,
  Prisma.UsersCreateInput,
  Prisma.UsersUpdateInput
> {
  private usersRepository: UsersRepository;

  constructor() {
    const repository = new UsersRepository();
    super(repository);
    this.usersRepository = repository;
  }

  async create(data: CreateUserDTO): Promise<Users> {
    const input = this.mapCreateDTOToInput(data);
    return this.repository.create(input);
  }

  async update(id: bigint, data: UpdateUserDTO): Promise<Users> {
    const input = this.mapUpdateDTOToInput(data);
    return this.repository.update(id, input);
  }

  // Custom methods
  async getUsersByAngkatan(angkatanId: bigint): Promise<Users[]> {
    return this.usersRepository.findByAngkatan(angkatanId);
  }

  async getUserByNomorWa(nomorWa: string): Promise<Users | null> {
    return this.usersRepository.findByNomorWa(nomorWa);
  }

  protected mapCreateDTOToInput(dto: CreateUserDTO): Prisma.UsersCreateInput {
    return {
      namaLengkap: dto.namaLengkap,
      namaPanggilan: dto.namaPanggilan,
      nomorWa: dto.nomorWa || null,
      angkatan: {
        connect: {
          id: dto.idAngkatan,
        },
      },
    };
  }

  protected mapUpdateDTOToInput(dto: UpdateUserDTO): Prisma.UsersUpdateInput {
    const input: Prisma.UsersUpdateInput = {};

    if (dto.namaLengkap !== undefined) input.namaLengkap = dto.namaLengkap;
    if (dto.namaPanggilan !== undefined)
      input.namaPanggilan = dto.namaPanggilan;
    if (dto.nomorWa !== undefined) input.nomorWa = dto.nomorWa;
    if (dto.idAngkatan !== undefined) {
      input.angkatan = {
        connect: {
          id: dto.idAngkatan,
        },
      };
    }

    return input;
  }
}
