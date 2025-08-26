# Kaizen API Architecture

## 📁 Struktur Folder

```
src/
├── controllers/         # HTTP request handlers
├── services/           # Business logic layer
├── repositories/       # Data access layer
├── routes/            # API route definitions
├── middleware/        # Custom middleware
├── types/            # TypeScript interfaces & types
├── utils/            # Utility functions
└── index.ts          # Application entry point
```

## 🏗️ Arsitektur

### 1. **Repository Layer** (`repositories/`)

- Bertanggung jawab untuk akses data ke database
- Menggunakan Prisma ORM
- Extends dari `BaseRepository`
- Contoh: `UsersRepository`

### 2. **Service Layer** (`services/`)

- Mengandung business logic
- Transformasi data antara DTO dan Model
- Extends dari `BaseService`
- Contoh: `UsersService`

### 3. **Controller Layer** (`controllers/`)

- Handle HTTP requests dan responses
- Validasi input
- Extends dari `BaseController`
- Contoh: `UsersController`

### 4. **Routes Layer** (`routes/`)

- Define API endpoints
- Route ke controller yang sesuai
- Contoh: `users.routes.ts`

## 🚀 Cara Membuat Module Baru

### 1. Buat Repository

```typescript
// src/repositories/example.repository.ts
import { Example, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class ExampleRepository extends BaseRepository<
  Example,
  Prisma.ExampleCreateInput,
  Prisma.ExampleUpdateInput
> {
  constructor() {
    super("example");
  }

  async findMany(): Promise<Example[]> {
    return this.db.example.findMany();
  }

  // Implement other required methods...
}
```

### 2. Buat Service

```typescript
// src/services/example.service.ts
import { BaseService } from './base.service';
import { ExampleRepository } from '../repositories/example.repository';

export interface CreateExampleDTO {
  name: string;
  // other fields...
}

export class ExampleService extends BaseService<...> {
  constructor() {
    const repository = new ExampleRepository();
    super(repository);
  }

  // Implement required methods...
}
```

### 3. Buat Controller

```typescript
// src/controllers/example.controller.ts
import { BaseController } from './base.controller';
import { ExampleService } from '../services/example.service';

export class ExampleController extends BaseController<...> {
  constructor() {
    const service = new ExampleService();
    super(service);
  }

  // Add custom endpoints if needed...
}
```

### 4. Buat Routes

```typescript
// src/routes/example.routes.ts
import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";

const router = Router();
const controller = new ExampleController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
```

### 5. Daftarkan Route

```typescript
// src/routes/index.ts
import exampleRoutes from "./example.routes";

// Add to router
router.use(`${API_VERSION}/examples`, exampleRoutes);
```

## 📋 API Endpoints

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/angkatan/:angkatanId` - Get users by angkatan
- `GET /api/v1/users/wa/:nomorWa` - Get user by WhatsApp number

### Standard Response Format

```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "pagination"?: {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## 🛠️ Development

### Build & Run

```bash
npm run build
npm start
```

### Development Mode

```bash
npm run dev
```

### Database

```bash
npx prisma generate
npx prisma migrate dev
```

## 📝 Notes

- Semua ID menggunakan `BigInt` sesuai dengan Prisma schema
- Error handling sudah ter-centralized di `ErrorMiddleware`
- Response format sudah ter-standardize di `ResponseUtil`
- Database connection menggunakan singleton pattern
- Graceful shutdown sudah diimplementasi
