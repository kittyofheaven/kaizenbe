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
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Kaizen API Documentation",
    })
  );
};

export default specs;
