import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types";

export class ResponseUtil {
  static success<T>(res: Response, data: T, message = "Success"): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.json(response);
  }

  static paginated<T>(
    res: Response,
    data: PaginatedResponse<T>,
    message = "Data retrieved successfully"
  ): Response {
    return res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      message,
    });
  }

  static error(
    res: Response,
    message = "Internal Server Error",
    statusCode = 500,
    errors?: string[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, message = "Resource not found"): Response {
    return this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message = "Bad request",
    errors?: string[]
  ): Response {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message = "Unauthorized"): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = "Forbidden"): Response {
    return this.error(res, message, 403);
  }
}
