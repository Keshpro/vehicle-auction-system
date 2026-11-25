USE vehicle_auction_dev;

DELIMITER $$

CREATE PROCEDURE sp_member02_audit_logs(
    IN p_from DATETIME,
    IN p_to DATETIME,
    IN p_action VARCHAR(100),
    IN p_entity_type VARCHAR(50),
    IN p_search VARCHAR(150),
    IN p_page_size INT,
    IN p_offset BIGINT
)
READS SQL DATA
SQL SECURITY INVOKER
BEGIN
    IF (p_from IS NOT NULL AND p_to IS NOT NULL AND p_from >= p_to)
        OR p_page_size IS NULL OR p_page_size NOT BETWEEN 1 AND 100
        OR p_offset IS NULL OR p_offset < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid audit dates or pagination';
    END IF;

    -- Existing free-form details can contain personal data such as emails.
    SELECT al.audit_log_id, al.actor_user_id, u.full_name AS actor_name,
           al.action, al.entity_type, al.entity_id, al.created_at
    FROM audit_logs AS al
    LEFT JOIN users AS u ON u.user_id = al.actor_user_id
    WHERE (p_from IS NULL OR al.created_at >= p_from)
      AND (p_to IS NULL OR al.created_at < p_to)
      AND (NULLIF(TRIM(p_action), '') IS NULL OR al.action = TRIM(p_action))
      AND (NULLIF(TRIM(p_entity_type), '') IS NULL OR al.entity_type = TRIM(p_entity_type))
      AND (NULLIF(TRIM(p_search), '') IS NULL
           OR LOCATE(TRIM(p_search), u.full_name) > 0
           OR LOCATE(TRIM(p_search), al.action) > 0
           OR LOCATE(TRIM(p_search), al.entity_type) > 0)
    ORDER BY al.created_at DESC, al.audit_log_id DESC
    LIMIT p_page_size OFFSET p_offset;
END$$

DELIMITER ;
