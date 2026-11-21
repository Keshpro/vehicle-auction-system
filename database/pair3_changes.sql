USE vehicle_auction_dev;

-- 1) Status values සීමා කරන්න
ALTER TABLE auctions ADD CONSTRAINT chk_auction_status
  CHECK (status IN ('Draft','Scheduled','Live','Closed','Cancelled'));

ALTER TABLE vehicle_lots ADD CONSTRAINT chk_lot_status
  CHECK (status IN ('Scheduled','Open','Closed','Withdrawn'));

ALTER TABLE vehicle_lots ADD CONSTRAINT chk_reserve_vs_start
  CHECK (reserve_price IS NULL OR reserve_price >= starting_price);

DELIMITER $$

-- 2) TRIGGER: lot එකක් add කරද්දී validation
CREATE TRIGGER trg_lot_before_insert
BEFORE INSERT ON vehicle_lots
FOR EACH ROW
BEGIN
  DECLARE a_start DATETIME;
  DECLARE a_end DATETIME;
  DECLARE a_status VARCHAR(20);

  SELECT starts_at, ends_at, status
    INTO a_start, a_end, a_status
  FROM auctions WHERE auction_id = NEW.auction_id;

  IF a_status IN ('Closed','Cancelled') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot add lots to a closed or cancelled auction';
  END IF;

  IF NEW.bidding_starts_at < a_start OR NEW.bidding_ends_at > a_end THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Lot bidding window must be inside the auction window';
  END IF;
END$$

-- 3) PROCEDURE: auction එක publish කරන්න (Draft -> Scheduled)
CREATE PROCEDURE sp_publish_auction(IN p_auction_id INT, IN p_actor INT)
BEGIN
  DECLARE v_status VARCHAR(20);
  DECLARE v_lots INT;

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

  IF v_status <> 'Draft' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only Draft auctions can be published';
  END IF;

  SELECT COUNT(*) INTO v_lots
  FROM vehicle_lots WHERE auction_id = p_auction_id;

  IF v_lots = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Add at least one lot before publishing';
  END IF;

  UPDATE auctions SET status = 'Scheduled' WHERE auction_id = p_auction_id;

  INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, details)
  VALUES (p_actor, 'PUBLISH_AUCTION', 'auction', p_auction_id, 'Draft -> Scheduled');

  COMMIT;
END$$

DELIMITER ;