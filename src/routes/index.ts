import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import communalRoutes from "./communal.routes";
import serbagunaRoutes from "./serbaguna.routes";
import mesinCuciCeweRoutes from "./mesin-cuci-cewe.routes";
import mesinCuciCowoRoutes from "./mesin-cuci-cowo.routes";
import dapurRoutes from "./dapur.routes";
import cwsRoutes from "./cws.routes";
import theaterRoutes from "./theater.routes";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

// API versioning
const API_VERSION = "/api/v1";

// Public routes (no authentication required)
router.use(`${API_VERSION}/auth`, authRoutes);

// Protected routes (authentication required)
router.use(`${API_VERSION}/users`, AuthMiddleware.authenticate, usersRoutes);
router.use(
  `${API_VERSION}/communal`,
  AuthMiddleware.authenticate,
  communalRoutes
);
router.use(
  `${API_VERSION}/serbaguna`,
  AuthMiddleware.authenticate,
  serbagunaRoutes
);
router.use(
  `${API_VERSION}/mesin-cuci-cewe`,
  AuthMiddleware.authenticate,
  mesinCuciCeweRoutes
);
router.use(
  `${API_VERSION}/mesin-cuci-cowo`,
  AuthMiddleware.authenticate,
  mesinCuciCowoRoutes
);
router.use(`${API_VERSION}/dapur`, AuthMiddleware.authenticate, dapurRoutes);
router.use(`${API_VERSION}/cws`, AuthMiddleware.authenticate, cwsRoutes);
router.use(`${API_VERSION}/theater`, AuthMiddleware.authenticate, theaterRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API info
router.get(`${API_VERSION}`, (req, res) => {
  res.json({
    success: true,
    message: "Kaizen API v1",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: `${API_VERSION}/auth`,
      users: `${API_VERSION}/users`,
      communal: `${API_VERSION}/communal`,
      serbaguna: `${API_VERSION}/serbaguna`,
      mesinCuciCewe: `${API_VERSION}/mesin-cuci-cewe`,
      mesinCuciCowo: `${API_VERSION}/mesin-cuci-cowo`,
      dapur: `${API_VERSION}/dapur`,
      cws: `${API_VERSION}/cws`,
      theater: `${API_VERSION}/theater`,
      // Add other endpoints here
    },
    authentication: {
      required: "All endpoints except /auth require JWT token",
      tokenType: "Bearer",
      expiresIn: "1h",
    },
  });
});

export default router;
