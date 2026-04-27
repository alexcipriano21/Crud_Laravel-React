-- DROP DATABASE crud_laravel;
CREATE DATABASE IF NOT EXISTS Crud_Laravel
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Crud_Laravel;

CREATE TABLE users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password            VARCHAR(255) NULL,
    imagen              VARCHAR(255) NULL,
    rol                 ENUM('administrador', 'colaborador', 'editor', 'supervisor') NOT NULL DEFAULT 'colaborador',
    estado              ENUM('activo','inactivo','pendiente') NOT NULL DEFAULT 'pendiente',
    check_verificado    BOOLEAN NOT NULL DEFAULT FALSE,
    telefono            VARCHAR(20) NULL,
    direccion           VARCHAR(255) NULL,
    google_id           VARCHAR(255) NULL,
    reset_token         VARCHAR(255) NULL,
    reset_token_expires TIMESTAMP NULL,
    remember_token      VARCHAR(100) NULL,
    email_verified_at   TIMESTAMP NULL,
    created_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER $$

-- 1. Login normal
CREATE PROCEDURE sp_login(IN p_email VARCHAR(255))
BEGIN
    SELECT id, nombre, email, password, imagen, rol, estado, check_verificado, google_id
    FROM users WHERE email = p_email LIMIT 1;
END$$

-- 2. Registrar usuario
CREATE PROCEDURE sp_registrar(
    IN p_nombre   VARCHAR(255),
    IN p_email    VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO users (nombre, email, password, rol)
    VALUES (p_nombre, p_email, p_password, 'administrador');
    SELECT LAST_INSERT_ID() AS id;
END$$

-- 3. Cambiar contraseña (perfil, ya logueado)
CREATE PROCEDURE sp_cambiarPassword(
    IN p_id       INT,
    IN p_password VARCHAR(255)
)
BEGIN
    UPDATE users SET password = p_password, updated_at = NOW()
    WHERE id = p_id;
END$$

-- 4. Guardar token de recuperación de contraseña
CREATE PROCEDURE sp_guardarToken(
    IN p_email VARCHAR(255),
    IN p_token VARCHAR(255)
)
BEGIN
    UPDATE users
    SET reset_token = p_token,
        reset_token_expires = DATE_ADD(NOW(), INTERVAL 60 MINUTE),
        updated_at = NOW()
    WHERE email = p_email;
END$$

-- 5. Resetear contraseña con token
CREATE PROCEDURE sp_actualizarPassword(
    IN p_email    VARCHAR(255),
    IN p_token    VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    IF EXISTS (
        SELECT 1 FROM users
        WHERE email = p_email
          AND reset_token = p_token
          AND reset_token_expires >= NOW()
    ) THEN
        UPDATE users
        SET password = p_password,
            reset_token = NULL,
            reset_token_expires = NULL,
            updated_at = NOW()
        WHERE email = p_email;
        SELECT 'success' AS resultado;
    ELSE
        SELECT 'token_invalido' AS resultado;
    END IF;
END$$

-- 6. Obtener todos los usuarios
CREATE PROCEDURE sp_obtenerUsuarios()
BEGIN
    SELECT id, nombre, email, imagen, rol, estado,
           check_verificado, telefono, direccion, created_at
    FROM users ORDER BY created_at ASC;
END$$

-- 7. Obtener usuario por ID
CREATE PROCEDURE sp_obtenerUsuario(IN p_id INT)
BEGIN
    SELECT * FROM users WHERE id = p_id;
END$$

-- 8. Crear usuario 
CREATE PROCEDURE sp_crearUsuario(
    IN p_nombre    VARCHAR(255),
    IN p_email     VARCHAR(255),
    IN p_password  VARCHAR(255),
    IN p_imagen    VARCHAR(255),
    IN p_rol       VARCHAR(20),
    IN p_estado    VARCHAR(20),
    IN p_telefono  VARCHAR(20),
    IN p_direccion VARCHAR(255)
)
BEGIN
    INSERT INTO users (nombre, email, password, imagen, rol, estado, telefono, direccion)
    VALUES (p_nombre, p_email, p_password, p_imagen, p_rol, p_estado, p_telefono, p_direccion);
    SELECT LAST_INSERT_ID() AS id;
END$$

-- 9. Actualizar usuario
CREATE PROCEDURE sp_actualizarUsuario(
    IN p_id        INT,
    IN p_nombre    VARCHAR(255),
    IN p_email     VARCHAR(255),
    IN p_imagen    VARCHAR(255),
    IN p_rol       VARCHAR(20),
    IN p_estado    VARCHAR(20),
    IN p_check     BOOLEAN,
    IN p_telefono  VARCHAR(20),
    IN p_direccion VARCHAR(255)
)
BEGIN
    UPDATE users
    SET nombre = p_nombre, email = p_email, imagen = p_imagen,
        rol = p_rol, estado = p_estado, check_verificado = p_check,
        telefono = p_telefono, direccion = p_direccion, updated_at = NOW()
    WHERE id = p_id;
END$$

-- 10. Eliminar usuario
CREATE PROCEDURE sp_eliminarUsuario(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
END$$

-- 11. Stats para las 3 cards del dashboard
CREATE PROCEDURE sp_dashboardStats()
BEGIN
    SELECT
        COUNT(*)                                AS total_usuarios,
        IFNULL(SUM(estado = 'activo'), 0)       AS total_activos,
        IFNULL(SUM(estado = 'inactivo'), 0)     AS total_inactivos,
        IFNULL(SUM(estado = 'pendiente'), 0)    AS total_pendientes
    FROM users
    WHERE rol != 'administrador';
END$$

-- 12. Datos para los 2 gráficos del dashboard
CREATE PROCEDURE sp_dashboardGraficos()
BEGIN
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS mes, 
        COUNT(*) AS total
    FROM users
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      AND rol != 'administrador'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY mes ASC;
    SELECT 
        rol, 
        COUNT(*) AS total
    FROM users 
    WHERE rol != 'administrador'
    GROUP BY rol;
END$$

DELIMITER ;

INSERT INTO users (nombre, email, password, rol, estado, telefono, direccion, check_verificado, created_at) VALUES
-- Noviembre 2025
('Carlos Mendoza', 'carlos.mendoza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'activo', '+34 611 222 333', 'Calle Alcalá 45, Madrid', 1, '2025-11-10 10:00:00'),
('Lucía Fernández', 'lucia.fer@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor', 'activo', '+34 622 333 444', 'Av. Diagonal 120, Barcelona', 1, '2025-11-25 14:00:00'),
-- Diciembre 2025
('Mateo Guerrero', 'm_guerrero@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'inactivo', '+34 633 444 555', 'Plaza Mayor 12, Salamanca', 0, '2025-12-05 09:30:00'),
-- Enero 2026
('Elena Vizcaíno', 'elena.viz@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'pendiente', '+34 644 555 666', 'Calle Betis 8, Sevilla', 0, '2026-01-15 11:20:00'),
('Javier Ortiz', 'j.ortiz@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor', 'activo', '+34 655 666 777', 'Calle Urzaiz 22, Vigo', 1, '2026-01-28 16:45:00'),
-- Febrero 2026
('Sofía Ramírez', 'sofia_ram@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'activo', '+34 666 777 888', 'Av. de la Constitución 5, Granada', 1, '2026-02-10 10:00:00'),
('Andrés Castro', 'a_castro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'inactivo', '+34 677 888 999', 'Calle Real 10, Zaragoza', 0, '2026-02-22 13:15:00'),
-- Marzo 2026
('Valentina Soler', 'v_soler@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor', 'pendiente', '+34 688 999 000', 'Calle Colón 34, Valencia', 0, '2026-03-05 08:30:00'),
('Ricardo Méndez', 'richi.mendez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'activo', '+34 699 000 111', 'Pasaje de la Victoria 3, Córdoba', 1, '2026-03-18 19:20:00'),
-- Abril 2026
('Isabel Torres', 'isatorres@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'activo', '+34 610 111 222', 'Rúa do Franco 15, Santiago', 1, '2026-04-02 12:00:00'),
('Fernando Rivas', 'frivas@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor', 'inactivo', '+34 620 222 333', 'Calle San Pablo 2, Valladolid', 0, '2026-04-10 15:30:00'),
('Marta Gallego', 'marta_gallego@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'colaborador', 'pendiente', '+34 630 333 444', 'Calle Herradores 9, Tenerife', 0, '2026-04-20 17:10:00');