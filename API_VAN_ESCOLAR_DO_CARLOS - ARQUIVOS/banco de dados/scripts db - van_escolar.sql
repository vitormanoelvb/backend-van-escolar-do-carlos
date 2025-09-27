CREATE DATABASE van_escolar;
USE van_escolar;

CREATE TABLE users (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('OWNER','DRIVER','ADMIN') NOT NULL DEFAULT 'DRIVER',
  reset_token   VARCHAR(191) NULL,
  reset_expires DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  full_name     VARCHAR(140) NOT NULL,
  phone         VARCHAR(40)  NULL,
  street        VARCHAR(140) NULL,
  number        VARCHAR(20)  NULL,
  neighborhood  VARCHAR(100) NULL,
  school        VARCHAR(140) NULL,
  shift         ENUM('MANHA','TARDE','NOITE','INTEGRAL') NULL,
  age           TINYINT UNSIGNED NULL,
  gender        ENUM('M','F','OUTRO') NULL,
  seat_number   TINYINT UNSIGNED NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  seat_unique   TINYINT UNSIGNED
                  GENERATED ALWAYS AS (IF(active AND seat_number IS NOT NULL, seat_number, NULL)) STORED,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_students_seat_unique (seat_unique),
  INDEX idx_students_name (full_name),
  INDEX idx_students_school (school)
);

CREATE TABLE routes (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  driver_id     BIGINT UNSIGNED NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_routes_driver FOREIGN KEY (driver_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE route_stops (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  route_id      BIGINT UNSIGNED NOT NULL,
  label         VARCHAR(140) NULL,
  street        VARCHAR(140) NULL,
  number        VARCHAR(20)  NULL,
  neighborhood  VARCHAR(100) NULL,
  latitude      DECIMAL(10,7) NULL,
  longitude     DECIMAL(10,7) NULL,
  order_index   INT UNSIGNED NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_stop_route FOREIGN KEY (route_id) REFERENCES routes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT uq_stop_order UNIQUE (route_id, order_index)
);

CREATE TABLE attendance (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  date_ref      DATE NOT NULL,
  route_id      BIGINT UNSIGNED NOT NULL,
  student_id    BIGINT UNSIGNED NOT NULL,
  status        ENUM('PRESENT','ABSENT','JUSTIFIED') NOT NULL DEFAULT 'PRESENT',
  notes         VARCHAR(240) NULL,
  marked_by     BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_att_route   FOREIGN KEY (route_id)   REFERENCES routes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_att_user    FOREIGN KEY (marked_by)  REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT uq_att_day UNIQUE (date_ref, route_id, student_id),
  INDEX idx_att_by_date_route (date_ref, route_id)
);

CREATE TABLE payments (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  student_id    BIGINT UNSIGNED NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  due_date      DATE NOT NULL,
  status        ENUM('OPEN','PAID','OVERDUE','CANCELLED') NOT NULL DEFAULT 'OPEN',
  method        ENUM('CASH','PIX','CARD','TRANSFER','OTHER') NULL,
  paid_at       DATETIME NULL,
  notes         VARCHAR(240) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_student FOREIGN KEY (student_id) REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_pay_student (student_id),
  INDEX idx_pay_due_status (due_date, status)
);
