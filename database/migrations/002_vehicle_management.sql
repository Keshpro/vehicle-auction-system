
-- Migration 002: Vehicle Management Tables
-- Creates the vehicle module's tables in dependency order.

-- 1. Consignors
CREATE TABLE IF NOT EXISTS consignors (
    consignor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(255)
);

-- 2. Yard Locations
CREATE TABLE IF NOT EXISTS yard_locations (
    yard_location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);

-- 3. Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    consignor_id INT NOT NULL,
    yard_location_id INT NOT NULL,
    registration_number VARCHAR(30) UNIQUE,
    chassis_number VARCHAR(50) NOT NULL UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacture_year INT NOT NULL,
    colour VARCHAR(30),
    mileage_km INT,
    fuel_type VARCHAR(30),
    transmission VARCHAR(30),
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (consignor_id)
        REFERENCES consignors(consignor_id),

    FOREIGN KEY (yard_location_id)
        REFERENCES yard_locations(yard_location_id),

    CHECK (mileage_km >= 0)
);

-- 4. Vehicle Photos
CREATE TABLE IF NOT EXISTS vehicle_photos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)
);
