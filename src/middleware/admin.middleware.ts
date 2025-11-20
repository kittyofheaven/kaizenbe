import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/database";
import { ResponseUtil } from "../utils/response";

export class AdminMiddleware {
  /**
   * Require the currently authenticated user to have admin-level access.
   * Uses a non-obvious column name (`accessLevel`) in the database.
   */
  static requireAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res, "Access token is required");
        return;
      }

      const userId = BigInt(req.user.id);

      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          accessLevel: true,
        },
      });

      if (!user || user.accessLevel !== "ADMIN") {
        ResponseUtil.forbidden(res, "Access denied");
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
