import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";

export class ErrorMiddleware {
  static handle = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.error("Error:", err);

    // Handle different types of errors
    if (err.message === "Resource not found") {
      ResponseUtil.notFound(res, err.message);
      return;
    }

    // Handle Prisma errors
    if (err.name === "PrismaClientKnownRequestError") {
      const prismaError = err as any;

      switch (prismaError.code) {
        case "P2002":
          ResponseUtil.badRequest(res, "Unique constraint violation", [
            prismaError.meta?.target,
          ]);
          return;
        case "P2025":
          ResponseUtil.notFound(res, "Record not found");
          return;
        case "P2003":
          ResponseUtil.badRequest(res, "Foreign key constraint violation");
          return;
        default:
          ResponseUtil.error(res, "Database error", 400);
          return;
      }
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      ResponseUtil.badRequest(res, "Validation failed", [err.message]);
      return;
    }

    // Default error
    ResponseUtil.error(res, "Internal server error", 500);
  };
}
