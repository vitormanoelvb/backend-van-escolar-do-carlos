-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'DRIVER',
    `resetToken` VARCHAR(191) NULL,
    `resetExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `neighborhood` VARCHAR(191) NULL,
    `school` VARCHAR(191) NULL,
    `shift` ENUM('MANHA', 'TARDE', 'NOITE', 'INTEGRAL') NULL,
    `age` INTEGER NULL,
    `gender` ENUM('M', 'F', 'OUTRO') NULL,
    `seatNumber` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Student_fullName_idx`(`fullName`),
    INDEX `Student_school_idx`(`school`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `driverId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteStop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `routeId` BIGINT NOT NULL,
    `label` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `neighborhood` VARCHAR(191) NULL,
    `latitude` DECIMAL(65, 30) NULL,
    `longitude` DECIMAL(65, 30) NULL,
    `orderIndex` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RouteStop_routeId_orderIndex_idx`(`routeId`, `orderIndex`),
    UNIQUE INDEX `RouteStop_routeId_orderIndex_key`(`routeId`, `orderIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dateRef` DATE NOT NULL,
    `routeId` BIGINT NOT NULL,
    `studentId` BIGINT NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'JUSTIFIED') NOT NULL DEFAULT 'PRESENT',
    `notes` VARCHAR(191) NULL,
    `markedBy` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Attendance_routeId_dateRef_idx`(`routeId`, `dateRef`),
    UNIQUE INDEX `Attendance_dateRef_routeId_studentId_key`(`dateRef`, `routeId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `studentId` BIGINT NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `dueDate` DATE NOT NULL,
    `status` ENUM('OPEN', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `method` ENUM('CASH', 'PIX', 'CARD', 'TRANSFER', 'OTHER') NULL,
    `paidAt` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Payment_studentId_idx`(`studentId`),
    INDEX `Payment_dueDate_status_idx`(`dueDate`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteStop` ADD CONSTRAINT `RouteStop_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_markedBy_fkey` FOREIGN KEY (`markedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
