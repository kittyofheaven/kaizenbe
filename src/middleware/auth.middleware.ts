import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { ResponseUtil } from "../utils/response";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // Removed sensitive data - only user ID stored
        // Other user details fetched from database when needed
      };
    }
  }
}

// SECURE: Minimal JWT payload - only user ID
export interface JwtPayload {
  sub: string; // Subject (user ID) - standard JWT claim
  iat?: number; // Issued at
  exp?: number; // Expires at
}

export class AuthMiddleware {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "kaizen_secret_key_2024";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

  /**
   * Generate secure JWT token with minimal payload (only user ID)
   */
  static generateToken(userId: string): string {
    const payload: Omit<JwtPayload, "iat" | "exp"> = {
      sub: userId, // Only user ID in payload for security
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: "1h" });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }

  /**
   * Authentication middleware
   */
  static authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        ResponseUtil.unauthorized(res, "Access token is required");
        return;
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

      if (!token) {
        ResponseUtil.unauthorized(res, "Access token is required");
        return;
      }

      const decoded = AuthMiddleware.verifyToken(token);
      req.user = {
        id: decoded.sub, // Extract user ID from 'sub' claim
        // No other sensitive data stored in req.user
        // Controllers should fetch user details from database when needed
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        ResponseUtil.unauthorized(res, "Invalid access token");
        return;
      }

      if (error instanceof jwt.TokenExpiredError) {
        ResponseUtil.unauthorized(res, "Access token has expired");
        return;
      }

      ResponseUtil.error(res, "Authentication failed", 401);
    }
  };

  /**
   * Optional authentication middleware (for endpoints that can work with or without auth)
   */
  static optionalAuthenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        next();
        return;
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

      if (!token) {
        next();
        return;
      }

      const decoded = AuthMiddleware.verifyToken(token);
      req.user = {
        id: decoded.sub, // Extract user ID from 'sub' claim
        // No other sensitive data stored in req.user
        // Controllers should fetch user details from database when needed
      };

      next();
    } catch (error) {
      // For optional auth, we don't fail on invalid tokens
      next();
    }
  };
}
