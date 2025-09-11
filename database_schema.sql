-- ========================================
-- KAIZEN FACILITY BOOKING SYSTEM
-- Database Schema Template
-- ========================================
-- 
-- This SQL file creates all tables for the Kaizen facility booking system
-- Run this script to set up the complete database structure
--
-- Usage:
-- mysql -u your_username -p your_database_name < database_schema.sql
-- or
-- mariadb -u your_username -p your_database_name < database_schema.sql

-- Set charset and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- CORE TABLES
-- ========================================

-- Table: Angkatan (Academic Year/Batch)
CREATE TABLE IF NOT EXISTS `Angkatan` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `namaAngkatan` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Users (Students/Staff)
CREATE TABLE IF NOT EXISTS `Users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idAngkatan` BIGINT NULL,
  `namaLengkap` VARCHAR(191) NOT NULL,
  `namaPanggilan` VARCHAR(191) NOT NULL,
  `nomorWa` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Users_idAngkatan_fkey` (`idAngkatan`),
  CONSTRAINT `Users_idAngkatan_fkey` FOREIGN KEY (`idAngkatan`) REFERENCES `Angkatan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- FACILITY BOOKING TABLES
-- ========================================

-- Table: Communal (Community/Common Area Booking)
CREATE TABLE IF NOT EXISTS `Communal` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idPenanggungJawab` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `jumlahPengguna` BIGINT NOT NULL,
  `lantai` BIGINT NOT NULL,
  `keterangan` TEXT NULL,
  `isDone` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_communal_waktuMulai` (`waktuMulai`),
  INDEX `idx_communal_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_communal_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `Communal_idPenanggungJawab_fkey` (`idPenanggungJawab`),
  CONSTRAINT `Communal_idPenanggungJawab_fkey` FOREIGN KEY (`idPenanggungJawab`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: AreaSerbaguna (Multipurpose Area)
CREATE TABLE IF NOT EXISTS `AreaSerbaguna` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `namaArea` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Serbaguna (Multipurpose Area Booking)
CREATE TABLE IF NOT EXISTS `Serbaguna` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idPenanggungJawab` BIGINT NOT NULL,
  `idArea` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `jumlahPengguna` BIGINT NOT NULL,
  `keterangan` TEXT NULL,
  `isDone` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_serbaguna_waktuMulai` (`waktuMulai`),
  INDEX `idx_serbaguna_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_serbaguna_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `Serbaguna_idArea_fkey` (`idArea`),
  INDEX `Serbaguna_idPenanggungJawab_fkey` (`idPenanggungJawab`),
  CONSTRAINT `Serbaguna_idArea_fkey` FOREIGN KEY (`idArea`) REFERENCES `AreaSerbaguna` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Serbaguna_idPenanggungJawab_fkey` FOREIGN KEY (`idPenanggungJawab`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Theater (Theater/Auditorium Booking)
CREATE TABLE IF NOT EXISTS `Theater` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idPenanggungJawab` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `jumlahPengguna` BIGINT NOT NULL,
  `keterangan` TEXT NULL,
  `isDone` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_theater_waktuMulai` (`waktuMulai`),
  INDEX `idx_theater_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_theater_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `Theater_idPenanggungJawab_fkey` (`idPenanggungJawab`),
  CONSTRAINT `Theater_idPenanggungJawab_fkey` FOREIGN KEY (`idPenanggungJawab`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: CWS (Computer Workstation Booking)
-- Note: CWS allows 2-hour slots unlike other facilities
CREATE TABLE IF NOT EXISTS `CWS` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idPenanggungJawab` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `jumlahPengguna` BIGINT NOT NULL,
  `keterangan` TEXT NULL,
  `isDone` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_cws_waktuMulai` (`waktuMulai`),
  INDEX `idx_cws_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_cws_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `CWS_idPenanggungJawab_fkey` (`idPenanggungJawab`),
  CONSTRAINT `CWS_idPenanggungJawab_fkey` FOREIGN KEY (`idPenanggungJawab`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- KITCHEN FACILITIES
-- ========================================

-- Table: FasilitasDapur (Kitchen Facilities)
CREATE TABLE IF NOT EXISTS `FasilitasDapur` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `fasilitas` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Dapur (Kitchen Booking)
CREATE TABLE IF NOT EXISTS `Dapur` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idPeminjam` BIGINT NOT NULL,
  `idFasilitas` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `pinjamPeralatan` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_dapur_waktuMulai` (`waktuMulai`),
  INDEX `idx_dapur_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_dapur_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `Dapur_idFasilitas_fkey` (`idFasilitas`),
  INDEX `Dapur_idPeminjam_fkey` (`idPeminjam`),
  CONSTRAINT `Dapur_idFasilitas_fkey` FOREIGN KEY (`idFasilitas`) REFERENCES `FasilitasDapur` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Dapur_idPeminjam_fkey` FOREIGN KEY (`idPeminjam`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- WASHING MACHINE FACILITIES
-- ========================================

-- Table: FasilitasMcCewe (Women's Washing Machine Facilities)
CREATE TABLE IF NOT EXISTS `FasilitasMcCewe` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: MesinCuciCewe (Women's Washing Machine Booking)
CREATE TABLE IF NOT EXISTS `MesinCuciCewe` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idFasilitas` BIGINT NOT NULL,
  `idPeminjam` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_mesin_cuci_cewe_waktuMulai` (`waktuMulai`),
  INDEX `idx_mesin_cuci_cewe_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_mesin_cuci_cewe_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `MesinCuciCewe_idFasilitas_fkey` (`idFasilitas`),
  INDEX `MesinCuciCewe_idPeminjam_fkey` (`idPeminjam`),
  CONSTRAINT `MesinCuciCewe_idFasilitas_fkey` FOREIGN KEY (`idFasilitas`) REFERENCES `FasilitasMcCewe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `MesinCuciCewe_idPeminjam_fkey` FOREIGN KEY (`idPeminjam`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: FasilitasMcCowo (Men's Washing Machine Facilities)
CREATE TABLE IF NOT EXISTS `FasilitasMcCowo` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: MesinCuciCowo (Men's Washing Machine Booking)
CREATE TABLE IF NOT EXISTS `MesinCuciCowo` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idFasilitas` BIGINT NOT NULL,
  `idPeminjam` BIGINT NOT NULL,
  `waktuMulai` DATETIME(3) NOT NULL,
  `waktuBerakhir` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_mesin_cuci_cowo_waktuMulai` (`waktuMulai`),
  INDEX `idx_mesin_cuci_cowo_waktuBerakhir` (`waktuBerakhir`),
  INDEX `idx_mesin_cuci_cowo_waktuMulai_waktuBerakhir` (`waktuMulai`, `waktuBerakhir`),
  INDEX `MesinCuciCowo_idFasilitas_fkey` (`idFasilitas`),
  INDEX `MesinCuciCowo_idPeminjam_fkey` (`idPeminjam`),
  CONSTRAINT `MesinCuciCowo_idFasilitas_fkey` FOREIGN KEY (`idFasilitas`) REFERENCES `FasilitasMcCowo` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `MesinCuciCowo_idPeminjam_fkey` FOREIGN KEY (`idPeminjam`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- SAMPLE DATA INSERTION
-- ========================================

-- Insert sample Angkatan data
INSERT IGNORE INTO `Angkatan` (`id`, `namaAngkatan`) VALUES 
(1, '2021'),
(2, '2022'),
(3, '2023'),
(4, '2024');

-- Insert sample Users data
INSERT IGNORE INTO `Users` (`id`, `idAngkatan`, `namaLengkap`, `namaPanggilan`, `nomorWa`) VALUES 
(1, 1, 'John Doe', 'John', '081234567890'),
(2, 1, 'Jane Smith', 'Jane', '081234567891'),
(3, 2, 'Bob Wilson', 'Bob', '081234567892'),
(4, 2, 'Alice Johnson', 'Alice', '081234567893');

-- Insert sample AreaSerbaguna data
INSERT IGNORE INTO `AreaSerbaguna` (`id`, `namaArea`) VALUES 
(1, 'Ruang Meeting A'),
(2, 'Ruang Meeting B'),
(3, 'Ruang Diskusi 1'),
(4, 'Ruang Diskusi 2');

-- Insert sample FasilitasDapur data
INSERT IGNORE INTO `FasilitasDapur` (`id`, `fasilitas`) VALUES 
(1, 'Kompor Gas'),
(2, 'Microwave'),
(3, 'Kulkas'),
(4, 'Blender');

-- Insert sample FasilitasMcCewe data
INSERT IGNORE INTO `FasilitasMcCewe` (`id`, `nama`) VALUES 
(1, 'Mesin Cuci A - Cewe'),
(2, 'Mesin Cuci B - Cewe'),
(3, 'Mesin Cuci C - Cewe');

-- Insert sample FasilitasMcCowo data
INSERT IGNORE INTO `FasilitasMcCowo` (`id`, `nama`) VALUES 
(1, 'Mesin Cuci A - Cowo'),
(2, 'Mesin Cuci B - Cowo'),
(3, 'Mesin Cuci C - Cowo');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

SELECT 'Database schema created successfully!' as Status;
SELECT 'Tables created:' as Info;
SELECT 
  TABLE_NAME as 'Table Name',
  TABLE_ROWS as 'Estimated Rows'
FROM 
  INFORMATION_SCHEMA.TABLES 
WHERE 
  TABLE_SCHEMA = DATABASE()
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY 
  TABLE_NAME;

-- ========================================
-- USAGE NOTES
-- ========================================
/*
FACILITY BOOKING RULES:
1. Communal, Serbaguna, Theater, Dapur, MesinCuci: 1-hour slots only
2. CWS: 2-hour slots allowed
3. All bookings must be in the future
4. No overlapping bookings for the same facility/area
5. Foreign key validation for all user references

TIME SLOT EXAMPLES:
- Valid 1-hour slots: 13:00-14:00, 14:00-15:00, 15:00-16:00
- Valid 2-hour slots (CWS only): 13:00-15:00, 15:00-17:00
- Invalid: 13:30-14:30, 13:00-14:30, 13:15-14:15

API ENDPOINTS AVAILABLE:
- GET/POST/PUT/DELETE for all booking tables
- Time slot suggestions
- Availability checking
- User-specific queries
- Facility-specific queries

For more information, see the API documentation at:
http://localhost:3000/api/docs
*/


