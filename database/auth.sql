USE vehicle_auction_dev;

DELIMITER $$

CREATE TRIGGER trg_36029_user_created
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs
    (
        actor_user_id,
        action,
        entity_type,
        entity_id,
        details
    )
    VALUES
    (
        NULL,
        'ACCOUNT_CREATED',
        'users',
        NEW.user_id,
        CONCAT('New account registered: ', NEW.email)
    );
END$$

DELIMITER ;