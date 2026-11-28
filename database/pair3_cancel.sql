USE vehicle_auction_dev;

DROP PROCEDURE IF EXISTS sp_cancel_auction;

DELIMITER $$

-- PROCEDURE: auction එක cancel කරන්න (Draft/Scheduled -> Cancelled)
CREATE PROCEDURE sp_cancel_auction(IN p_auction_id INT, IN p_actor INT)
BEGIN
  DECLARE v_status VARCHAR(20);

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT status INTO v_status
  FROM auctions WHERE auction_id = p_auction_id FOR UPDATE;

  IF v_status IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Auction not found';
  END IF;

  IF v_status NOT IN ('Draft', 'Scheduled') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Only Draft or Scheduled auctions can be cancelled';
  END IF;

  UPDATE auctions SET status = 'Cancelled' WHERE auction_id = p_auction_id;

  INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, details)
  VALUES (p_actor, 'CANCEL_AUCTION', 'auction', p_auction_id,
          CONCAT(v_status, ' -> Cancelled'));

  COMMIT;
END$$

DELIMITER ;
