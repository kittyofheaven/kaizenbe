import { Router } from "express";
import usersRoutes from "./users.routes";
import communalRoutes from "./communal.routes";
import serbagunaRoutes from "./serbaguna.routes";
import mesinCuciCeweRoutes from "./mesin-cuci-cewe.routes";
import mesinCuciCowoRoutes from "./mesin-cuci-cowo.routes";
import dapurRoutes from "./dapur.routes";
// Import other routes here
// import cwsRoutes from './cws.routes';
// import theaterRoutes from './theater.routes';

const router = Router();

// API versioning
const API_VERSION = "/api/v1";

// Register routes
router.use(`${API_VERSION}/users`, usersRoutes);
router.use(`${API_VERSION}/communal`, communalRoutes);
router.use(`${API_VERSION}/serbaguna`, serbagunaRoutes);
router.use(`${API_VERSION}/mesin-cuci-cewe`, mesinCuciCeweRoutes);
router.use(`${API_VERSION}/mesin-cuci-cowo`, mesinCuciCowoRoutes);
router.use(`${API_VERSION}/dapur`, dapurRoutes);
// router.use(`${API_VERSION}/cws`, cwsRoutes);
// router.use(`${API_VERSION}/theater`, theaterRoutes);

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
      users: `${API_VERSION}/users`,
      communal: `${API_VERSION}/communal`,
      serbaguna: `${API_VERSION}/serbaguna`,
      mesinCuciCewe: `${API_VERSION}/mesin-cuci-cewe`,
      mesinCuciCowo: `${API_VERSION}/mesin-cuci-cowo`,
      dapur: `${API_VERSION}/dapur`,
      // Add other endpoints here
      // cws: `${API_VERSION}/cws`,
      // theater: `${API_VERSION}/theater`,
    },
  });
});

export default router;
