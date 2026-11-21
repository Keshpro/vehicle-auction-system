CREATE DATABASE IF NOT EXISTS vehicle_auction_dev;
USE vehicle_auction_dev;

-- 1. People who use the app
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    account_status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Available roles: Admin, Staff, Bidder
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL UNIQUE
);

-- 3. Connect each user to their roles
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 4. Extra information about bidders
CREATE TABLE bidder_profiles (
    user_id INT PRIMARY KEY,
    address VARCHAR(255),
    approval_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    approved_by INT,
    approved_at DATETIME,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);
SHOW TABLES;
USE vehicle_auction_dev;

-- 5. People or businesses supplying vehicles
CREATE TABLE consignors (
    consignor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(255)
);

-- 6. Places where vehicles are kept
CREATE TABLE yard_locations (
    yard_location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);

-- 7. Vehicle details
CREATE TABLE vehicles (
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

-- 8. Photos belonging to each vehicle
CREATE TABLE vehicle_photos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)
);
USE vehicle_auction_dev;
SHOW TABLES;
USE vehicle_auction_dev;

-- 9. Auction events
CREATE TABLE auctions (
    auction_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    created_by INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(user_id),

    CHECK (ends_at > starts_at)
);

-- 10. Vehicles offered in each auction
CREATE TABLE vehicle_lots (
    lot_id INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    lot_number INT NOT NULL,
    starting_price DECIMAL(12,2) NOT NULL,
    reserve_price DECIMAL(12,2),
    minimum_increment DECIMAL(12,2) NOT NULL,
    bidding_starts_at DATETIME NOT NULL,
    bidding_ends_at DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',

    FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id),

    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id),

    UNIQUE (auction_id, lot_number),
    UNIQUE (auction_id, vehicle_id),

    CHECK (lot_number > 0),
    CHECK (starting_price >= 0),
    CHECK (reserve_price >= 0),
    CHECK (minimum_increment > 0),
    CHECK (bidding_ends_at > bidding_starts_at)
);

-- 11. Bidders registered for each auction
CREATE TABLE auction_participations (
    participation_id INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT NOT NULL,
    bidder_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Registered',
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id),

    FOREIGN KEY (bidder_id)
        REFERENCES bidder_profiles(user_id),

    UNIQUE (auction_id, bidder_id)
);
USE vehicle_auction_dev;
SHOW TABLES;
USE vehicle_auction_dev;

-- 12. Offers made by bidders
CREATE TABLE bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    lot_id INT NOT NULL,
    bidder_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    placed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    request_id VARCHAR(36) NOT NULL UNIQUE,

    FOREIGN KEY (lot_id)
        REFERENCES vehicle_lots(lot_id),

    FOREIGN KEY (bidder_id)
        REFERENCES bidder_profiles(user_id),

    CHECK (amount > 0),

    UNIQUE (lot_id, bid_id)
);

-- 13. Final result of each lot
CREATE TABLE lot_results (
    lot_id INT PRIMARY KEY,
    winning_bid_id INT,
    result_status VARCHAR(20) NOT NULL,
    closed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lot_id)
        REFERENCES vehicle_lots(lot_id),

    FOREIGN KEY (lot_id, winning_bid_id)
        REFERENCES bids(lot_id, bid_id),

    UNIQUE (winning_bid_id),

    CHECK (
        (result_status = 'Sold' AND winning_bid_id IS NOT NULL)
        OR
        (
            result_status IN ('Unsold', 'Withdrawn')
            AND winning_bid_id IS NULL
        )
    )
);
USE vehicle_auction_dev;
SHOW TABLES;
USE vehicle_auction_dev;

-- 14. Messages shown to users
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

-- 15. History of important actions
CREATE TABLE audit_logs (
    audit_log_id INT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (actor_user_id)
        REFERENCES users(user_id)
);

-- 16. Events waiting to be processed
CREATE TABLE outbox_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    attempt_count INT NOT NULL DEFAULT 0,

    CHECK (attempt_count >= 0)
);
USE vehicle_auction_dev;
SHOW TABLES;