# 📋 Facility Booking Modules Implementation Guide

## ✅ **Completed Modules**

### 1. **Communal Module**

- ✅ Repository: `src/repositories/communal.repository.ts`
- ✅ Service: `src/services/communal.service.ts`
- ✅ Controller: `src/controllers/communal.controller.ts`
- ✅ Routes: `src/routes/communal.routes.ts`
- ✅ Time Validation: **1 hour slots** (13:00-14:00)
- ✅ Swagger Documentation: Complete with examples
- ✅ Foreign Key Validation: `idPenanggungJawab` → Users table
- ✅ Conflict Detection: Same floor, same time

### 2. **Time Validation Utility**

- ✅ File: `src/utils/time-validation.ts`
- ✅ 1-hour slot validation for most facilities
- ✅ 2-hour slot validation for CWS
- ✅ Time slot suggestions
- ✅ Past time validation

## 🏗️ **Template Structure for Remaining Modules**

### **Serbaguna Module**

```typescript
// Repository: Similar to Communal but with AreaSerbaguna relation
// Service: 1-hour validation + area conflict check
// Controller: Handle idArea BigInt conversion
// Routes: Include area-specific endpoints
// Validation: idPenanggungJawab → Users, idArea → AreaSerbaguna
```

### **Theater Module**

```typescript
// Repository: Single theater facility (like CWS)
// Service: 1-hour validation + single facility conflict
// Controller: Standard facility booking pattern
// Routes: Theater-specific endpoints
// Validation: idPenanggungJawab → Users
```

### **CWS Module**

```typescript
// Repository: Single CWS facility
// Service: 2-HOUR validation (13:00-15:00)
// Controller: Handle 2-hour time slots
// Routes: CWS-specific 2-hour slots
// Validation: idPenanggungJawab → Users
```

### **Dapur Module**

```typescript
// Repository: With FasilitasDapur relation
// Service: 1-hour validation + facility-specific conflict
// Controller: Handle idFasilitas + pinjamPeralatan boolean
// Routes: Include facility-specific endpoints
// Validation: idPeminjam → Users, idFasilitas → FasilitasDapur
```

### **MesinCuciCewe Module**

```typescript
// Repository: With FasilitasMcCewe relation
// Service: 1-hour validation + facility-specific conflict
// Controller: Handle idFasilitas BigInt conversion
// Routes: Include facility availability
// Validation: idPeminjam → Users, idFasilitas → FasilitasMcCewe
```

### **MesinCuciCowo Module**

```typescript
// Repository: With FasilitasMcCowo relation
// Service: 1-hour validation + facility-specific conflict
// Controller: Handle idFasilitas BigInt conversion
// Routes: Include facility availability
// Validation: idPeminjam → Users, idFasilitas → FasilitasMcCowo
```

## 🔧 **Implementation Steps for Each Module**

### 1. **Repository** (`repositories/{module}.repository.ts`)

```typescript
import { {Model}, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class {Model}Repository extends BaseRepository<
  {Model},
  Prisma.{Model}CreateInput,
  Prisma.{Model}UpdateInput
> {
  constructor() {
    super("{modelName}");
  }

  // Implement: findMany, findById, create, update, delete
  // Add: findByTimeRange, findByPenanggungJawab/Peminjam
  // Add: checkTimeConflict with facility-specific logic
}
```

### 2. **Service** (`services/{module}.service.ts`)

```typescript
export interface Create{Model}DTO {
  idPenanggungJawab: bigint; // or idPeminjam
  waktuMulai: Date;
  waktuBerakhir: Date;
  jumlahPengguna: bigint;
  // Add facility-specific fields
}

export class {Model}Service extends BaseService<...> {
  async create(data: Create{Model}DTO): Promise<{Model}> {
    // 1. Validate time slots (1-hour or 2-hour for CWS)
    // 2. Validate future time
    // 3. Validate foreign keys
    // 4. Check time conflicts
    // 5. Create record
  }
}
```

### 3. **Controller** (`controllers/{module}.controller.ts`)

```typescript
export class {Model}Controller extends BaseController<...> {
  // Override create/update for BigInt conversion
  // Add custom endpoints:
  // - getByPenanggungJawab/Peminjam
  // - getAvailableTimeSlots
  // - getTimeSlotSuggestions
  // - Facility-specific endpoints
}
```

### 4. **Routes** (`routes/{module}.routes.ts`)

```typescript
/**
 * @swagger
 * tags:
 *   name: {Model}
 *   description: {Model} booking management
 */

// Standard CRUD with comprehensive Swagger docs
// Custom endpoints with examples
// Time slot endpoints
// Validation error examples
```

## ⏰ **Time Validation Rules**

### **1-Hour Slots** (Most Facilities)

- ✅ **Valid**: 13:00:00 → 14:00:00
- ❌ **Invalid**: 13:30:00 → 14:30:00 (not exact hour)
- ❌ **Invalid**: 13:00:00 → 15:00:00 (not 1 hour)

### **2-Hour Slots** (CWS Only)

- ✅ **Valid**: 13:00:00 → 15:00:00
- ❌ **Invalid**: 13:00:00 → 14:00:00 (not 2 hours)
- ❌ **Invalid**: 13:30:00 → 15:30:00 (not exact hour)

## 🔑 **Foreign Key Validations**

| Module        | Foreign Keys                                          |
| ------------- | ----------------------------------------------------- |
| Communal      | `idPenanggungJawab` → Users                           |
| Serbaguna     | `idPenanggungJawab` → Users, `idArea` → AreaSerbaguna |
| Theater       | `idPenanggungJawab` → Users                           |
| CWS           | `idPenanggungJawab` → Users                           |
| Dapur         | `idPeminjam` → Users, `idFasilitas` → FasilitasDapur  |
| MesinCuciCewe | `idPeminjam` → Users, `idFasilitas` → FasilitasMcCewe |
| MesinCuciCowo | `idPeminjam` → Users, `idFasilitas` → FasilitasMcCowo |

## 📚 **Swagger Documentation Requirements**

### **Must Include:**

- ✅ Complete request/response schemas
- ✅ Validation error examples
- ✅ Time slot format examples
- ✅ Foreign key validation errors
- ✅ Conflict detection examples
- ✅ Available time slots endpoint
- ✅ Custom endpoints documentation

### **Example Responses:**

```json
// Success
{
  "success": true,
  "data": {...},
  "message": "Booking berhasil dibuat"
}

// Validation Error
{
  "success": false,
  "message": "Waktu booking harus dalam slot 1 jam penuh (contoh: 13:00-14:00)"
}

// Conflict Error
{
  "success": false,
  "message": "Fasilitas sudah dibooking pada waktu tersebut"
}
```

## 🚀 **Next Steps**

1. **Implement remaining modules** using the template above
2. **Update routes/index.ts** to register all routes
3. **Test all endpoints** with Swagger UI
4. **Add integration tests** for time validation
5. **Document API usage** in README

## 📝 **Notes**

- All time validations are handled in `TimeValidationUtil`
- Foreign key validations use direct Prisma queries
- Conflict detection is facility-specific
- Swagger docs include comprehensive examples
- Error messages are user-friendly in Indonesian
