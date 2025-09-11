# 🗄️ Database Setup Guide

Panduan lengkap untuk setup database Kaizen Facility Booking System.

## 📋 Prerequisites

- MySQL/MariaDB server running
- Database user dengan privileges CREATE, INSERT, SELECT, UPDATE, DELETE
- Database `kaizen` sudah dibuat

## 🚀 Quick Setup

### 1. Import Database Schema

```bash
# Menggunakan MySQL
mysql -u your_username -p kaizen < database_schema.sql

# Menggunakan MariaDB
mariadb -u your_username -p kaizen < database_schema.sql

# Contoh dengan user kaizenuser
mariadb -u kaizenuser -ppasswordku kaizen < database_schema.sql
```

### 2. Verifikasi Installation

```sql
-- Login ke database
mysql -u your_username -p kaizen

-- Atau
mariadb -u your_username -p kaizen

-- Cek tabel yang sudah dibuat
SHOW TABLES;

-- Cek sample data
SELECT * FROM Users;
SELECT * FROM AreaSerbaguna;
```

## 📊 Database Structure

### 🏢 Core Tables

| Table      | Purpose                | Records          |
| ---------- | ---------------------- | ---------------- |
| `Angkatan` | Academic years/batches | 4 sample records |
| `Users`    | Students and staff     | 4 sample records |

### 🏠 Facility Tables

| Facility            | Table           | Area/Facility Table | Time Slots |
| ------------------- | --------------- | ------------------- | ---------- |
| **Communal**        | `Communal`      | -                   | 1 hour     |
| **Serbaguna**       | `Serbaguna`     | `AreaSerbaguna`     | 1 hour     |
| **Theater**         | `Theater`       | -                   | 1 hour     |
| **CWS**             | `CWS`           | -                   | 2 hours    |
| **Dapur**           | `Dapur`         | `FasilitasDapur`    | 1 hour     |
| **Mesin Cuci Cewe** | `MesinCuciCewe` | `FasilitasMcCewe`   | 1 hour     |
| **Mesin Cuci Cowo** | `MesinCuciCowo` | `FasilitasMcCowo`   | 1 hour     |

## 📝 Sample Data Included

### 👥 Users

```
ID | Name | Nickname | Phone | Angkatan
1  | John Doe | John | 081234567890 | 2021
2  | Jane Smith | Jane | 081234567891 | 2021
3  | Bob Wilson | Bob | 081234567892 | 2022
4  | Alice Johnson | Alice | 081234567893 | 2022
```

### 🏠 Areas & Facilities

```
Serbaguna Areas:
- Ruang Meeting A
- Ruang Meeting B
- Ruang Diskusi 1
- Ruang Diskusi 2

Kitchen Facilities:
- Kompor Gas
- Microwave
- Kulkas
- Blender

Washing Machines:
- 3 Women's machines
- 3 Men's machines
```

## 🔧 Database Features

### ⚡ Performance Optimizations

- **Time-based indexes** on all booking tables
- **Composite indexes** for time range queries
- **Foreign key indexes** for join performance

### 🛡️ Data Integrity

- **Foreign key constraints** prevent orphaned records
- **NOT NULL constraints** on required fields
- **Default values** for timestamps and boolean fields

### 📅 Time Management

- **DATETIME(3)** precision for millisecond accuracy
- **Automatic timestamps** with `createdAt` and `updatedAt`
- **Time zone support** ready

## 🔍 Useful Queries

### Check All Tables

```sql
SELECT
  TABLE_NAME as 'Table',
  TABLE_ROWS as 'Rows',
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'kaizen'
ORDER BY TABLE_NAME;
```

### Check Indexes

```sql
SELECT
  TABLE_NAME,
  INDEX_NAME,
  COLUMN_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'kaizen'
ORDER BY TABLE_NAME, INDEX_NAME;
```

### Check Foreign Keys

```sql
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'kaizen'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## 🚨 Troubleshooting

### Error: "Access denied"

```bash
# Check user privileges
SHOW GRANTS FOR 'kaizenuser'@'localhost';

# Grant necessary privileges
GRANT ALL PRIVILEGES ON kaizen.* TO 'kaizenuser'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Table already exists"

```sql
-- Drop all tables (DANGEROUS - will lose data!)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS MesinCuciCowo, MesinCuciCewe, FasilitasMcCowo, FasilitasMcCewe;
DROP TABLE IF EXISTS Dapur, FasilitasDapur;
DROP TABLE IF EXISTS CWS, Theater, Serbaguna, AreaSerbaguna, Communal;
DROP TABLE IF EXISTS Users, Angkatan;
SET FOREIGN_KEY_CHECKS = 1;

-- Then re-import
SOURCE database_schema.sql;
```

### Error: "Foreign key constraint fails"

```sql
-- Check foreign key relationships
SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'kaizen';

-- Disable foreign key checks temporarily (if needed)
SET FOREIGN_KEY_CHECKS = 0;
-- Your operations here
SET FOREIGN_KEY_CHECKS = 1;
```

## 🔄 Updates & Migrations

### Adding New Data

```sql
-- Add new user
INSERT INTO Users (namaLengkap, namaPanggilan, nomorWa, idAngkatan)
VALUES ('New User', 'NewUser', '081234567894', 1);

-- Add new area
INSERT INTO AreaSerbaguna (namaArea)
VALUES ('Ruang Meeting C');

-- Add new facility
INSERT INTO FasilitasDapur (fasilitas)
VALUES ('Rice Cooker');
```

### Schema Changes

When making schema changes, always:

1. Backup your data first
2. Test on development environment
3. Use `ALTER TABLE` statements
4. Update the `database_schema.sql` file

## 📚 Next Steps

1. ✅ Database setup complete
2. 🚀 Start the API server: `npm run dev`
3. 📖 Check API docs: `http://localhost:3000/api/docs`
4. 🧪 Test endpoints using Swagger UI
5. 📱 Build your frontend application

## 🆘 Support

If you encounter issues:

1. Check the error logs
2. Verify database connection in `.env`
3. Ensure all foreign key relationships are valid
4. Check the API documentation for correct data formats

---

**Database Schema Version**: 1.0  
**Last Updated**: 2024  
**Compatible with**: MySQL 5.7+, MariaDB 10.3+


