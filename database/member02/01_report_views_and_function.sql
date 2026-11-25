-- Apply with the MySQL client after the shared schema is installed.
USE vehicle_auction_dev;

CREATE SQL SECURITY INVOKER VIEW v_member02_auction_report AS
SELECT
    a.auction_id,
    a.title,
    a.starts_at,
    a.status,
    COUNT(l.lot_id) AS lot_count,
    COUNT(CASE WHEN r.result_status = 'Sold' THEN 1 END) AS sold_lot_count,
    COALESCE(SUM(bs.bid_count), 0) AS bid_count,
    ROUND(AVG(CASE WHEN l.lot_id IS NOT NULL THEN COALESCE(bs.bid_count, 0) END), 2)
        AS average_bids_per_lot,
    COALESCE(SUM(w.amount), 0) AS sales_total,
    ROUND(SUM(bs.bid_total) / NULLIF(SUM(bs.bid_count), 0), 2) AS average_bid,
    MIN(bs.minimum_bid) AS minimum_bid,
    MAX(bs.maximum_bid) AS maximum_bid
FROM auctions AS a
LEFT JOIN vehicle_lots AS l ON l.auction_id = a.auction_id
LEFT JOIN (
    -- Collapse bids to one row per lot before joining the final result.
    SELECT lot_id, COUNT(*) AS bid_count, SUM(amount) AS bid_total,
           MIN(amount) AS minimum_bid, MAX(amount) AS maximum_bid
    FROM bids
    GROUP BY lot_id
) AS bs ON bs.lot_id = l.lot_id
LEFT JOIN lot_results AS r ON r.lot_id = l.lot_id
LEFT JOIN bids AS w ON w.lot_id = r.lot_id
                  AND w.bid_id = r.winning_bid_id
                  AND r.result_status = 'Sold'
GROUP BY a.auction_id, a.title, a.starts_at, a.status;

CREATE FUNCTION fn_member02_sale_rate(
    p_sold_lot_count BIGINT UNSIGNED,
    p_lot_count BIGINT UNSIGNED
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
NO SQL
SQL SECURITY INVOKER
RETURN ROUND(100.00 * p_sold_lot_count / NULLIF(p_lot_count, 0), 2);
