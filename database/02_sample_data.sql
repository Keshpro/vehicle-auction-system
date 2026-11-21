USE vehicle_auction_dev;

START TRANSACTION;

-- Available user roles
INSERT INTO roles (role_name)
VALUES ('Admin'), ('Staff'), ('Bidder');

-- One owner supplying vehicles
INSERT INTO consignors (name, phone, email, address)
VALUES (
    'Sample Vehicle Owner',
    '0771234567',
    'owner@example.com',
    'Colombo'
);

SET @sample_consignor_id = LAST_INSERT_ID();

-- One place where vehicles are kept
INSERT INTO yard_locations (location_name, address)
VALUES ('Main Yard', 'Colombo');

SET @sample_yard_id = LAST_INSERT_ID();

-- Two sample vehicles
INSERT INTO vehicles (
    consignor_id,
    yard_location_id,
    registration_number,
    chassis_number,
    make,
    model,
    manufacture_year,
    colour,
    mileage_km,
    fuel_type,
    transmission,
    description
)
VALUES
(
    @sample_consignor_id,
    @sample_yard_id,
    'DEMO-001',
    'DEMO-CHASSIS-001',
    'Toyota',
    'Aqua',
    2020,
    'White',
    45000,
    'Hybrid',
    'Automatic',
    'Sample vehicle for development'
),
(
    @sample_consignor_id,
    @sample_yard_id,
    'DEMO-002',
    'DEMO-CHASSIS-002',
    'Honda',
    'Fit',
    2019,
    'Blue',
    60000,
    'Petrol',
    'Automatic',
    'Sample vehicle for development'
);

COMMIT;
SELECT
    v.vehicle_id,
    v.make,
    v.model,
    c.name AS owner_name,
    y.location_name
FROM vehicles v
JOIN consignors c
    ON v.consignor_id = c.consignor_id
JOIN yard_locations y
    ON v.yard_location_id = y.yard_location_id;
USE vehicle_auction_dev;

START TRANSACTION;

-- Sample admin: login disabled
INSERT INTO users (
    full_name,
    email,
    password_hash,
    phone,
    account_status
)
VALUES (
    'Demo Admin',
    'admin@example.com',
    'DEMO_ONLY_NO_LOGIN',
    '0771111111',
    'Inactive'
);

SET @demo_admin_id = LAST_INSERT_ID();

-- Give this user the Admin role
INSERT INTO user_roles (user_id, role_id)
SELECT @demo_admin_id, role_id
FROM roles
WHERE role_name = 'Admin';

-- Sample bidder: login disabled
INSERT INTO users (
    full_name,
    email,
    password_hash,
    phone,
    account_status
)
VALUES (
    'Demo Bidder',
    'bidder@example.com',
    'DEMO_ONLY_NO_LOGIN',
    '0772222222',
    'Inactive'
);

SET @demo_bidder_id = LAST_INSERT_ID();

-- Give this user the Bidder role
INSERT INTO user_roles (user_id, role_id)
SELECT @demo_bidder_id, role_id
FROM roles
WHERE role_name = 'Bidder';

-- Extra information about the bidder
INSERT INTO bidder_profiles (
    user_id,
    address,
    approval_status
)
VALUES (
    @demo_bidder_id,
    'Kandy',
    'Pending'
);

COMMIT;
SELECT
    u.user_id,
    u.full_name,
    u.email,
    r.role_name,
    u.account_status
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id;
USE vehicle_auction_dev;

START TRANSACTION;

-- Find the sample admin
SET @demo_admin_id = (
    SELECT user_id
    FROM users
    WHERE email = 'admin@example.com'
);

-- Create an auction scheduled for tomorrow
INSERT INTO auctions (
    title,
    description,
    starts_at,
    ends_at,
    status,
    created_by
)
VALUES (
    'Demo Vehicle Auction',
    'Sample auction for team development',
    NOW() + INTERVAL 1 DAY,
    NOW() + INTERVAL 1 DAY + INTERVAL 2 HOUR,
    'Draft',
    @demo_admin_id
);

SET @demo_auction_id = LAST_INSERT_ID();

-- Lot 1: Toyota Aqua
INSERT INTO vehicle_lots (
    auction_id,
    vehicle_id,
    lot_number,
    starting_price,
    reserve_price,
    minimum_increment,
    bidding_starts_at,
    bidding_ends_at,
    status
)
SELECT
    a.auction_id,
    v.vehicle_id,
    1,
    5000000.00,
    5500000.00,
    25000.00,
    a.starts_at,
    a.ends_at,
    'Scheduled'
FROM auctions a
CROSS JOIN vehicles v
WHERE a.auction_id = @demo_auction_id
  AND v.chassis_number = 'DEMO-CHASSIS-001';

-- Lot 2: Honda Fit
INSERT INTO vehicle_lots (
    auction_id,
    vehicle_id,
    lot_number,
    starting_price,
    reserve_price,
    minimum_increment,
    bidding_starts_at,
    bidding_ends_at,
    status
)
SELECT
    a.auction_id,
    v.vehicle_id,
    2,
    4500000.00,
    5000000.00,
    25000.00,
    a.starts_at,
    a.ends_at,
    'Scheduled'
FROM auctions a
CROSS JOIN vehicles v
WHERE a.auction_id = @demo_auction_id
  AND v.chassis_number = 'DEMO-CHASSIS-002';

COMMIT;
SELECT
    a.title,
    l.lot_number,
    v.make,
    v.model,
    l.starting_price,
    l.status
FROM vehicle_lots l
JOIN auctions a ON l.auction_id = a.auction_id
JOIN vehicles v ON l.vehicle_id = v.vehicle_id;