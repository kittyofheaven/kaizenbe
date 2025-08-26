import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";
import { BaseController } from "./base.controller";
import {
  UsersService,
  CreateUserDTO,
  UpdateUserDTO,
} from "../services/users.service";
import { ResponseUtil } from "../utils/response";

export class UsersController extends BaseController<
  Users,
  CreateUserDTO,
  UpdateUserDTO
> {
  private usersService: UsersService;

  constructor() {
    const service = new UsersService();
    super(service);
    this.usersService = service;
  }

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
