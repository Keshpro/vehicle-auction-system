USE vehicle_auction_dev;

-- InnoDB secondary indexes already include the primary key as a tie-breaker.
ALTER TABLE audit_logs
    ADD INDEX idx_member02_audit_created_at (created_at),
    ADD INDEX idx_member02_audit_action_created_at (action, created_at),
    ADD INDEX idx_member02_audit_entity_created_at (entity_type, created_at);

ALTER TABLE auctions
    ADD INDEX idx_member02_auctions_starts_at (starts_at);
