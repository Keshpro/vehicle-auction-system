-- Pair 03: index to speed up filtering auctions by status
-- Before: EXPLAIN SELECT * FROM auctions WHERE status = 'Scheduled';  -> type=ALL, key=NULL, rows=4 (full table scan)
-- After:  type=ref, key=idx_auctions_status, rows=2 (index lookup)
CREATE INDEX idx_auctions_status ON auctions (status);

-- Usage check
EXPLAIN SELECT * FROM auctions WHERE status = 'Scheduled';
