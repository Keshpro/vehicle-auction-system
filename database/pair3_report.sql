USE vehicle_auction_dev;

DROP PROCEDURE IF EXISTS sp_auction_lot_report;

DELIMITER $$

CREATE PROCEDURE sp_auction_lot_report(IN p_auction_id INT)
BEGIN
    DECLARE v_done      INT DEFAULT 0;
    DECLARE v_lot_id    INT;
    DECLARE v_price     DECIMAL(12,2);
    DECLARE v_state     VARCHAR(20);
    DECLARE v_total     INT DEFAULT 0;
    DECLARE v_sched     INT DEFAULT 0;
    DECLARE v_open      INT DEFAULT 0;
    DECLARE v_closed    INT DEFAULT 0;
    DECLARE v_withdrawn INT DEFAULT 0;
    DECLARE v_sum_price DECIMAL(14,2) DEFAULT 0;

    DECLARE cur CURSOR FOR
        SELECT lot_id, starting_price
          FROM vehicle_lots
         WHERE auction_id = p_auction_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_lot_id, v_price;
        IF v_done = 1 THEN LEAVE read_loop; END IF;

        SET v_state = fn_lot_current_status(v_lot_id);
        SET v_total = v_total + 1;
        SET v_sum_price = v_sum_price + v_price;

        IF v_state = 'Scheduled' THEN SET v_sched = v_sched + 1;
        ELSEIF v_state = 'Open' THEN SET v_open = v_open + 1;
        ELSEIF v_state = 'Closed' THEN SET v_closed = v_closed + 1;
        ELSEIF v_state = 'Withdrawn' THEN SET v_withdrawn = v_withdrawn + 1;
        END IF;
    END LOOP;
    CLOSE cur;

    SELECT p_auction_id AS auction_id, v_total AS total_lots,
           v_sched AS scheduled, v_open AS open_lots,
           v_closed AS closed, v_withdrawn AS withdrawn,
           v_sum_price AS total_starting_price;
END$$

DELIMITER ;

CALL sp_auction_lot_report(1);