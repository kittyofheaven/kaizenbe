import { Router } from "express";
import usersRoutes from "./users.routes";
// Import other routes here
// import serbagunaRoutes from './serbaguna.routes';
// import communalRoutes from './communal.routes';

const router = Router();

// API versioning
const API_VERSION = "/api/v1";

// Register routes
router.use(`${API_VERSION}/users`, usersRoutes);
// router.use(`${API_VERSION}/serbaguna`, serbagunaRoutes);
// router.use(`${API_VERSION}/communal`, communalRoutes);

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
      // Add other endpoints here
    },
  });
});

export default router;
