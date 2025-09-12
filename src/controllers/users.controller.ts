import { Request, Response, NextFunction } from "express";
import {
  UsersService,
  CreateUserDTO,
  UpdateUserDTO,
  UserWithoutPassword,
} from "../services/users.service";
import { ResponseUtil } from "../utils/response";
import { PaginationParams } from "../types";

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  // Standard CRUD operations
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const users = await this.usersService.getAll(params);
      ResponseUtil.success(res, users, "Data retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id!);
      const user = await this.usersService.getById(id);

      if (!user) {
        ResponseUtil.notFound(res, "User not found");
        return;
      }

      ResponseUtil.success(res, user, "Data retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // This endpoint is deprecated - redirect to use auth/register
      ResponseUtil.badRequest(
        res,
        "Use /api/v1/auth/register for creating users"
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id!);
      const updateData: UpdateUserDTO = req.body;

      const user = await this.usersService.update(id, updateData);
      ResponseUtil.success(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id!);
      await this.usersService.delete(id);
      ResponseUtil.success(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  // Custom endpoints
  getUsersByAngkatan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const angkatanId = BigInt(req.params.angkatanId!);
      const users = await this.usersService.getUsersByAngkatan(angkatanId);
      ResponseUtil.success(res, users, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getUserByNomorWa = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nomorWa } = req.params;
      const user = await this.usersService.getUserByNomorWa(nomorWa!);

      if (!user) {
        ResponseUtil.notFound(res, "User not found");
        return;
      }

      ResponseUtil.success(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
}
