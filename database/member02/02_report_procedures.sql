USE vehicle_auction_dev;

DELIMITER $$

-- Date ranges use an inclusive start and an exclusive end.
CREATE PROCEDURE sp_member02_auction_report(
    IN p_from DATETIME,
    IN p_to DATETIME,
    IN p_min_bids BIGINT,
    IN p_search VARCHAR(150)
)
READS SQL DATA
SQL SECURITY INVOKER
BEGIN
    IF p_from IS NULL OR p_to IS NULL OR p_from >= p_to
        OR p_min_bids IS NULL OR p_min_bids < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid report dates or minimum bid count';
    END IF;

    SELECT r.*, fn_member02_sale_rate(r.sold_lot_count, r.lot_count) AS sale_rate_pct
    FROM v_member02_auction_report AS r
    WHERE r.starts_at >= p_from AND r.starts_at < p_to
      AND r.bid_count >= p_min_bids
      AND (NULLIF(TRIM(p_search), '') IS NULL OR LOCATE(TRIM(p_search), r.title) > 0)
    ORDER BY r.starts_at DESC, r.auction_id DESC;
END$$

-- One report row per audit action that meets the requested activity threshold.
CREATE PROCEDURE sp_member02_audit_activity_report(
    IN p_from DATETIME,
    IN p_to DATETIME,
    IN p_min_actions BIGINT
)
READS SQL DATA
SQL SECURITY INVOKER
BEGIN
    IF p_from IS NULL OR p_to IS NULL OR p_from >= p_to
        OR p_min_actions IS NULL OR p_min_actions < 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid audit dates or minimum action count';
    END IF;

    SELECT action, COUNT(*) AS action_count,
           MIN(created_at) AS first_action_at, MAX(created_at) AS last_action_at
    FROM audit_logs
    WHERE created_at >= p_from AND created_at < p_to
    GROUP BY action
    HAVING COUNT(*) >= p_min_actions
    ORDER BY action_count DESC, action;
END$$

-- Cursor example: build a report for a date range one auction at a time.
CREATE PROCEDURE sp_member02_auction_report_cursor(
    IN p_from DATETIME,
    IN p_to DATETIME
)
READS SQL DATA
SQL SECURITY INVOKER
BEGIN
    DECLARE v_done BOOLEAN DEFAULT FALSE;
    DECLARE v_auction_id INT;
    DECLARE v_title VARCHAR(150);
    DECLARE v_sales_total DECIMAL(32,2);
    DECLARE v_sale_rate DECIMAL(5,2);
    DECLARE v_report JSON DEFAULT (JSON_ARRAY());

    DECLARE report_rows CURSOR FOR
        SELECT auction_id, title, sales_total,
               fn_member02_sale_rate(sold_lot_count, lot_count)
        FROM v_member02_auction_report
        WHERE starts_at >= p_from AND starts_at < p_to
        ORDER BY starts_at DESC, auction_id DESC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    IF p_from IS NULL OR p_to IS NULL OR p_from >= p_to THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid cursor report dates';
    END IF;

    OPEN report_rows;
    report_loop: LOOP
        FETCH report_rows INTO v_auction_id, v_title, v_sales_total, v_sale_rate;
        IF v_done THEN
            LEAVE report_loop;
        END IF;
        SET v_report = JSON_ARRAY_APPEND(v_report, '$', JSON_OBJECT(
            'auction_id', v_auction_id,
            'title', v_title,
            'sales_total', v_sales_total,
            'sale_rate_pct', v_sale_rate
        ));
    END LOOP;
    CLOSE report_rows;

    SELECT v_report AS auction_report;
END$$

DELIMITER ;
