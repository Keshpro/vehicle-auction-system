USE vehicle_auction_dev;

DROP FUNCTION IF EXISTS fn_lot_current_status;

DELIMITER $$

CREATE FUNCTION fn_lot_current_status(p_lot_id INT)
RETURNS VARCHAR(20)
READS SQL DATA
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_starts DATETIME;
    DECLARE v_ends   DATETIME;

    SELECT status, bidding_starts_at, bidding_ends_at
      INTO v_status, v_starts, v_ends
      FROM vehicle_lots
     WHERE lot_id = p_lot_id;

    IF v_status IS NULL THEN RETURN 'NotFound'; END IF;
    IF v_status = 'Withdrawn' THEN RETURN 'Withdrawn'; END IF;

    IF NOW() < v_starts THEN RETURN 'Scheduled';
    ELSEIF NOW() <= v_ends THEN RETURN 'Open';
    ELSE RETURN 'Closed';
    END IF;
END$$

DELIMITER ;

SELECT lot_id, status, fn_lot_current_status(lot_id) AS computed_status
FROM vehicle_lots;