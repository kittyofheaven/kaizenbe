import { Users, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";
import { UsersRepository } from "../repositories/users.repository";

// Type for User without password
export type UserWithoutPassword = Omit<Users, "password">;

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

export class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  /**
   * Remove password from user object
   */
  private removePassword(user: Users): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Remove password from array of users
   */
  private removePasswordFromArray(users: Users[]): UserWithoutPassword[] {
    return users.map((user) => this.removePassword(user));
  }

  async create(data: CreateUserDTO): Promise<UserWithoutPassword> {
    // Note: This method should not be used for creating users with passwords
    // Use AuthService.register instead
    throw new Error(
      "Use AuthService.register for creating users with passwords"
    );
  }

  async update(id: bigint, data: UpdateUserDTO): Promise<UserWithoutPassword> {
    const input = this.mapUpdateDTOToInput(data);
    const user = await this.usersRepository.update(id, input);
    return this.removePassword(user);
  }

  async getById(id: bigint): Promise<UserWithoutPassword | null> {
    const user = await this.usersRepository.findById(id);
    return user ? this.removePassword(user) : null;
  }

  async getAll(params?: any): Promise<UserWithoutPassword[]> {
    const users = await this.usersRepository.findMany(params);
    return this.removePasswordFromArray(users);
  }

  async delete(id: bigint): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Custom methods
  async getUsersByAngkatan(angkatanId: bigint): Promise<UserWithoutPassword[]> {
    const users = await this.usersRepository.findByAngkatan(angkatanId);
    return this.removePasswordFromArray(users);
  }

  async getUserByNomorWa(nomorWa: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersRepository.findByNomorWa(nomorWa);
    return user ? this.removePassword(user) : null;
  }

  protected mapCreateDTOToInput(dto: CreateUserDTO): Prisma.UsersCreateInput {
    return {
      namaLengkap: dto.namaLengkap,
      namaPanggilan: dto.namaPanggilan,
      nomorWa: dto.nomorWa || null,
      password: "temp_password", // This should not be used - use AuthService instead
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
