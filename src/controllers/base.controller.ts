import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { BaseService } from "../services/base.service";
import { PaginationParams } from "../types";

export abstract class BaseController<T, CreateDTO, UpdateDTO> {
  protected service: BaseService<T, CreateDTO, UpdateDTO, any, any>;

  constructor(service: BaseService<T, CreateDTO, UpdateDTO, any, any>) {
    this.service = service;
  }

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params: PaginationParams = {
        ...(req.query.page && { page: parseInt(req.query.page as string) }),
        ...(req.query.limit && { limit: parseInt(req.query.limit as string) }),
        ...(req.query.sortBy && { sortBy: req.query.sortBy as string }),
        ...(req.query.sortOrder && {
          sortOrder: req.query.sortOrder as "asc" | "desc",
        }),
      };

      const result = await this.service.getAll(params);
      ResponseUtil.paginated(res, result);
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
      const result = await this.service.getById(id);
      ResponseUtil.success(res, result);
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
      const result = await this.service.create(req.body);
      ResponseUtil.success(res, result, "Resource created successfully");
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
      const result = await this.service.update(id, req.body);
      ResponseUtil.success(res, result, "Resource updated successfully");
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
      await this.service.delete(id);
      ResponseUtil.success(res, null, "Resource deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
