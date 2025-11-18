import bcrypt from "bcryptjs";
import { Users } from "@prisma/client";
import DatabaseConnection from "../utils/database";
import { AuthMiddleware } from "../middleware/auth.middleware";

export interface LoginDTO {
  nomorWa: string;
  password: string;
}

export interface RegisterDTO {
  idAngkatan?: string;
  namaLengkap: string;
  namaPanggilan: string;
  nomorWa: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<Users, "password">;
  token: string;
  expiresIn: string;
}

export class AuthService {
  private prisma = DatabaseConnection.getInstance();

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password
   */
  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Login user by WhatsApp number only
   * (used for trusted system integrations like n8n)
   */
  async loginByNomorWa(nomorWa: string): Promise<LoginResponse> {
    // Find user by WhatsApp number
    const user = await this.prisma.users.findFirst({
      where: { nomorWa },
      include: {
        angkatan: true,
      },
    });

    if (!user) {
      throw new Error("Nomor WhatsApp tidak ditemukan");
    }

    // Generate secure JWT token with only user ID
    const token = AuthMiddleware.generateToken(user.id.toString());

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: "1h",
    };
  }

  /**
   * Login user
   */
  async login(loginData: LoginDTO): Promise<LoginResponse> {
    const { nomorWa, password } = loginData;

    // Find user by WhatsApp number
    const user = await this.prisma.users.findFirst({
      where: { nomorWa },
      include: {
        angkatan: true,
      },
    });

    if (!user) {
      throw new Error("Nomor WhatsApp atau password tidak valid");
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Nomor WhatsApp atau password tidak valid");
    }

    // Generate secure JWT token with only user ID
    const token = AuthMiddleware.generateToken(user.id.toString());

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: "1h",
    };
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterDTO): Promise<LoginResponse> {
    const { idAngkatan, namaLengkap, namaPanggilan, nomorWa, password } =
      registerData;

    // Check if user already exists
    const existingUser = await this.prisma.users.findFirst({
      where: { nomorWa },
    });

    if (existingUser) {
      throw new Error("Nomor WhatsApp sudah terdaftar");
    }

    // Validate angkatan if provided
    if (idAngkatan) {
      const angkatan = await this.prisma.angkatan.findUnique({
        where: { id: BigInt(idAngkatan) },
      });

      if (!angkatan) {
        throw new Error("Angkatan tidak ditemukan");
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await this.prisma.users.create({
      data: {
        idAngkatan: idAngkatan ? BigInt(idAngkatan) : null,
        namaLengkap,
        namaPanggilan,
        nomorWa,
        password: hashedPassword,
      },
      include: {
        angkatan: true,
      },
    });

    // Generate secure JWT token with only user ID
    const token = AuthMiddleware.generateToken(user.id.toString());

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: "1h",
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<Omit<Users, "password"> | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      include: {
        angkatan: true,
      },
    });

    if (!user) {
      return null;
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user password
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Password saat ini tidak valid");
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password
    await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { password: hashedNewPassword },
    });
  }
}
