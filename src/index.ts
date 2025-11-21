import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { type CorsOptions } from "cors";

// Import routes and middleware
import routes from "./routes";
import { ErrorMiddleware } from "./middleware/error.middleware";
import DatabaseConnection from "./utils/database";
import { setupSwagger } from "./utils/swagger";
import { BigIntSerializer } from "./utils/bigint-serializer";

// Load environment variables
dotenv.config();

// Configure BigInt serialization
BigIntSerializer.configureGlobalSerialization();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup (hard-coded allowed origins)
const allowedOrigins = [
  "https://admin.rtbconnect.space",
  "https://n8n.rtbconnect.space",
  "https://rtbconnect.space",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use(routes);

// 404 handler - catch all unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handling middleware
app.use(ErrorMiddleware.handle);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await DatabaseConnection.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await DatabaseConnection.disconnect();
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api/v1`);
});

export default app;
