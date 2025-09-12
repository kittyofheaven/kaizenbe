import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kaizen API",
      version: "1.0.0",
      description: "API documentation for Kaizen facility booking system",
      contact: {
        name: "API Support",
        email: "support@kaizen.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token (without Bearer prefix)",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["idAngkatan", "namaLengkap", "namaPanggilan"],
          properties: {
            id: {
              type: "string",
              format: "int64",
              description: "User ID",
              example: "1",
            },
            idAngkatan: {
              type: "string",
              format: "int64",
              description: "Angkatan ID",
              example: "1",
            },
            namaLengkap: {
              type: "string",
              description: "Full name",
              example: "John Doe",
            },
            namaPanggilan: {
              type: "string",
              description: "Nickname",
              example: "John",
            },
            nomorWa: {
              type: "string",
              nullable: true,
              description: "WhatsApp number",
              example: "+6281234567890",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
            angkatan: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "int64",
                },
                namaAngkatan: {
                  type: "string",
                },
              },
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["idAngkatan", "namaLengkap", "namaPanggilan"],
          properties: {
            idAngkatan: {
              type: "string",
              format: "int64",
              description: "Angkatan ID",
              example: "1",
            },
            namaLengkap: {
              type: "string",
              description: "Full name",
              example: "John Doe",
            },
            namaPanggilan: {
              type: "string",
              description: "Nickname",
              example: "John",
            },
            nomorWa: {
              type: "string",
              nullable: true,
              description: "WhatsApp number",
              example: "+6281234567890",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            idAngkatan: {
              type: "string",
              format: "int64",
              description: "Angkatan ID",
              example: "1",
            },
            namaLengkap: {
              type: "string",
              description: "Full name",
              example: "John Doe",
            },
            namaPanggilan: {
              type: "string",
              description: "Nickname",
              example: "John",
            },
            nomorWa: {
              type: "string",
              nullable: true,
              description: "WhatsApp number",
              example: "+6281234567890",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Request success status",
            },
            message: {
              type: "string",
              description: "Response message",
            },
            data: {
              description: "Response data",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Error messages",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  example: 10,
                },
                total: {
                  type: "integer",
                  example: 100,
                },
                totalPages: {
                  type: "integer",
                  example: 10,
                },
              },
            },
            message: {
              type: "string",
              example: "Data retrieved successfully",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Validation error"],
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request - Invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Validation failed",
                errors: ["Field is required"],
              },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized - Authentication required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Access token is required",
              },
            },
          },
        },
        Forbidden: {
          description: "Forbidden - Access denied",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Access denied",
              },
            },
          },
        },
        NotFound: {
          description: "Not Found - Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        Conflict: {
          description:
            "Conflict - Resource already exists or conflicts with current state",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Resource already exists",
              },
            },
          },
        },
        UnprocessableEntity: {
          description: "Unprocessable Entity - Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Validation failed",
                errors: ["Invalid date format", "Required field missing"],
              },
            },
          },
        },
        InternalServerError: {
          description:
            "Internal Server Error - Something went wrong on the server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Internal server error",
              },
            },
          },
        },
      },
      parameters: {
        PageParam: {
          name: "page",
          in: "query",
          description: "Page number for pagination",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
        },
        LimitParam: {
          name: "limit",
          in: "query",
          description: "Number of items per page",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        SortByParam: {
          name: "sortBy",
          in: "query",
          description: "Field to sort by",
          required: false,
          schema: {
            type: "string",
          },
        },
        SortOrderParam: {
          name: "sortOrder",
          in: "query",
          description: "Sort order",
          required: false,
          schema: {
            type: "string",
            enum: ["asc", "desc"],
            default: "asc",
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .btn.authorize { 
          background-color: #4CAF50 !important;
          border-color: #4CAF50 !important;
        }
        .swagger-ui .btn.authorize:hover {
          background-color: #45a049 !important;
          border-color: #45a049 !important;
        }
      `,
      customSiteTitle: "Kaizen API Documentation",
      swaggerOptions: {
        persistAuthorization: true, // Keep token after page refresh
        tryItOutEnabled: true,
        filter: true,
        displayRequestDuration: true,
        docExpansion: "none", // Don't expand endpoints by default
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        // Custom authorization configuration
        authAction: {
          bearerAuth: {
            name: "bearerAuth",
            schema: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            value: "Bearer <your_jwt_token_here>",
          },
        },
      },
      customJs: [
        // Add custom JavaScript to enhance UI
        `
        window.onload = function() {
          // Add helpful text to authorize button
          setTimeout(function() {
            const authorizeBtn = document.querySelector('.btn.authorize');
            if (authorizeBtn) {
              authorizeBtn.setAttribute('title', 'Click to add your JWT token for authentication');
            }
          }, 1000);
        }
        `,
      ],
    })
  );
};

export default specs;
