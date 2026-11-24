USE vehicle_auction_dev;

DROP FUNCTION IF EXISTS fn_get_required_bid_amount;

DELIMITER $$

CREATE FUNCTION fn_get_required_bid_amount(
    p_starting_price DECIMAL(12,2),
    p_highest_bid DECIMAL(12,2),
    p_minimum_increment DECIMAL(12,2)
)
RETURNS DECIMAL(12,2)
DETERMINISTIC
NO SQL
BEGIN
    DECLARE v_required_amount DECIMAL(12,2);

    IF p_highest_bid IS NULL THEN
        SET v_required_amount = p_starting_price;
    ELSE
        SET v_required_amount = p_highest_bid + p_minimum_increment;
    END IF;

    RETURN v_required_amount;
END$$

DELIMITER ;