import { Request, Response, NextFunction } from "express";
import { AuthService, LoginDTO, RegisterDTO } from "../services/auth.service";
import { ResponseUtil } from "../utils/response";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login endpoint
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: LoginDTO = {
        nomorWa: req.body.nomorWa,
        password: req.body.password,
      };

      // Basic validation
      if (!loginData.nomorWa || !loginData.password) {
        ResponseUtil.badRequest(res, "Nomor WhatsApp dan password harus diisi");
        return;
      }

      const result = await this.authService.login(loginData);
      ResponseUtil.success(res, result, "Login berhasil");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("tidak valid") ||
          error.message.includes("tidak ditemukan")
        ) {
          ResponseUtil.unauthorized(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Special login endpoint for n8n integration
   * Uses shared secret from N8N_PASS env variable instead of user password
   */
  n8nLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nomorWa, n8nPass } = req.body as {
        nomorWa?: string;
        n8nPass?: string;
      };

      // Basic validation
      if (!nomorWa || !n8nPass) {
        ResponseUtil.badRequest(res, "Nomor WhatsApp dan n8nPass harus diisi");
        return;
      }

      const expectedPass = process.env.N8N_PASS;

      // If env not set or secret mismatch, reject
      if (!expectedPass || n8nPass !== expectedPass) {
        ResponseUtil.unauthorized(res, "N8N credential tidak valid");
        return;
      }

      const result = await this.authService.loginByNomorWa(nomorWa);
      ResponseUtil.success(res, result, "Login n8n berhasil");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("tidak valid") ||
          error.message.includes("tidak ditemukan")
        ) {
          ResponseUtil.unauthorized(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Register endpoint
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const registerData: RegisterDTO = {
        idAngkatan: req.body.idAngkatan,
        namaLengkap: req.body.namaLengkap,
        namaPanggilan: req.body.namaPanggilan,
        nomorWa: req.body.nomorWa,
        password: req.body.password,
      };

      // Basic validation
      if (
        !registerData.namaLengkap ||
        !registerData.namaPanggilan ||
        !registerData.nomorWa ||
        !registerData.password
      ) {
        ResponseUtil.badRequest(res, "Semua field wajib harus diisi");
        return;
      }

      // Password strength validation
      if (registerData.password.length < 6) {
        ResponseUtil.badRequest(res, "Password minimal 6 karakter");
        return;
      }

      const result = await this.authService.register(registerData);
      res.status(201);
      ResponseUtil.success(res, result, "Registrasi berhasil");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("sudah terdaftar") ||
          error.message.includes("tidak ditemukan")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res, "User tidak terautentikasi");
        return;
      }

      const user = await this.authService.getProfile(req.user.id);
      if (!user) {
        ResponseUtil.notFound(res, "User tidak ditemukan");
        return;
      }

      ResponseUtil.success(res, user, "Profile berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update password
   */
  updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res, "User tidak terautentikasi");
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Basic validation
      if (!currentPassword || !newPassword) {
        ResponseUtil.badRequest(
          res,
          "Password lama dan password baru harus diisi"
        );
        return;
      }

      // Password strength validation
      if (newPassword.length < 6) {
        ResponseUtil.badRequest(res, "Password baru minimal 6 karakter");
        return;
      }

      await this.authService.updatePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      ResponseUtil.success(res, null, "Password berhasil diupdate");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("tidak valid") ||
          error.message.includes("tidak ditemukan")
        ) {
          ResponseUtil.badRequest(res, error.message);
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Logout endpoint (client-side token removal)
   */
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Since we're using stateless JWT, logout is handled on client-side
      // This endpoint just confirms successful logout
      ResponseUtil.success(res, null, "Logout berhasil");
    } catch (error) {
      next(error);
    }
  };
}
