USE vehicle_auction_dev;

SELECT
    u.full_name,
    u.email,
    r.role_name,
    u.account_status
FROM users AS u
LEFT JOIN user_roles AS ur ON u.user_id = ur.user_id
LEFT JOIN roles AS r ON ur.role_id = r.role_id
ORDER BY u.user_id;
-- List bidders waiting for approval
SELECT
    u.user_id,
    u.full_name,
    u.email,
    bp.approval_status
FROM bidder_profiles AS bp
JOIN users AS u ON bp.user_id = u.user_id
WHERE bp.approval_status = 'Pending'
ORDER BY u.user_id;
