
using MySqlConnector;
using VehicleAuction.Api.DTOs;

namespace VehicleAuction.Api.Repositories;

public class BidRepository
{
    private readonly string _connectionString;

    public BidRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "DefaultConnection is not configured.");
    }

    // Get the current highest bid for a lot.
    public async Task<decimal?> GetHighestBidAsync(int lotId)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = """
            SELECT MAX(amount)
            FROM bids
            WHERE lot_id = @lotId;
            """;

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@lotId", lotId);

        var result = await command.ExecuteScalarAsync();

        if (result == null || result == DBNull.Value)
            return null;

        return Convert.ToDecimal(result);
    }

    // Validate and submit a bid safely.
    public async Task<BidResponse> PlaceBidAsync(
        int lotId,
        int bidderId,
        decimal amount,
        Guid requestId)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var transaction = await connection.BeginTransactionAsync();

        // 1. Check whether this request was already processed.
        const string duplicateSql = """
            SELECT bid_id, lot_id, bidder_id, amount, placed_at
            FROM bids
            WHERE request_id = @requestId;
            """;

        await using (var duplicateCommand =
            new MySqlCommand(duplicateSql, connection, transaction))
        {
            duplicateCommand.Parameters.AddWithValue(
                "@requestId", requestId.ToString());

            await using var reader = await duplicateCommand.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var existingLotId = reader.GetInt32("lot_id");
                var existingBidderId = reader.GetInt32("bidder_id");
                var existingAmount = reader.GetDecimal("amount");

                if (existingLotId != lotId ||
                    existingBidderId != bidderId ||
                    existingAmount != amount)
                {
                    throw new InvalidOperationException(
                        "This request ID has already been used for another bid.");
                }

                var existingResponse = new BidResponse
                {
                    BidId = reader.GetInt32("bid_id"),
                    LotId = existingLotId,
                    BidderId = existingBidderId,
                    Amount = existingAmount,
                    PlacedAt = reader.GetDateTime("placed_at")
                };

                await reader.CloseAsync();
                await transaction.CommitAsync();

                return existingResponse;
            }
        }

        // 2. Lock the lot so simultaneous bids are processed safely.
        const string lotSql = """
            SELECT
                l.starting_price,
                l.minimum_increment,
                l.bidding_starts_at,
                l.bidding_ends_at,
                l.status AS lot_status,
                a.status AS auction_status
            FROM vehicle_lots l
            INNER JOIN auctions a ON a.auction_id = l.auction_id
            WHERE l.lot_id = @lotId
            FOR UPDATE;
            """;

        decimal startingPrice;
        decimal minimumIncrement;
        DateTime biddingStartsAt;
        DateTime biddingEndsAt;
        string lotStatus;
        string auctionStatus;

        await using (var lotCommand =
            new MySqlCommand(lotSql, connection, transaction))
        {
            lotCommand.Parameters.AddWithValue("@lotId", lotId);

            await using var reader = await lotCommand.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                throw new InvalidOperationException("Vehicle lot not found.");

            startingPrice = reader.GetDecimal("starting_price");
            minimumIncrement = reader.GetDecimal("minimum_increment");
            biddingStartsAt = reader.GetDateTime("bidding_starts_at");
            biddingEndsAt = reader.GetDateTime("bidding_ends_at");
            lotStatus = reader.GetString("lot_status");
            auctionStatus = reader.GetString("auction_status");
        }

        // 3. Validate auction and lot statuses.
        if (auctionStatus != "Live")
            throw new InvalidOperationException("Auction is not live.");

        if (lotStatus != "Open")
            throw new InvalidOperationException("This lot is not open for bidding.");

        // 4. Validate bidder eligibility.
        const string eligibilitySql = """
            SELECT u.full_name
            FROM users u
            INNER JOIN bidder_profiles bp ON bp.user_id = u.user_id
            INNER JOIN auction_participations ap
                ON ap.bidder_id = bp.user_id
            INNER JOIN vehicle_lots l
                ON l.auction_id = ap.auction_id
            WHERE u.user_id = @bidderId
              AND l.lot_id = @lotId
              AND u.account_status = 'Active'
              AND bp.approval_status = 'Approved'
              AND ap.status = 'Registered';
            """;

        string bidderName;

        await using (var eligibilityCommand =
            new MySqlCommand(eligibilitySql, connection, transaction))
        {
            eligibilityCommand.Parameters.AddWithValue("@bidderId", bidderId);
            eligibilityCommand.Parameters.AddWithValue("@lotId", lotId);

            var result = await eligibilityCommand.ExecuteScalarAsync();

            if (result == null || result == DBNull.Value)
            {
                throw new InvalidOperationException(
                    "Bidder is not eligible to participate in this auction.");
            }

            bidderName = Convert.ToString(result)!;
        }

        // 5. Validate the bidding time.
        var currentTime = DateTime.Now;

        if (currentTime < biddingStartsAt || currentTime > biddingEndsAt)
            throw new InvalidOperationException("Bidding is not open at this time.");

        // 6. Find the highest existing bid.
        const string highestBidSql = """
            SELECT MAX(amount)
            FROM bids
            WHERE lot_id = @lotId;
            """;

        decimal? highestBid;

        await using (var highestCommand =
            new MySqlCommand(highestBidSql, connection, transaction))
        {
            highestCommand.Parameters.AddWithValue("@lotId", lotId);

            var result = await highestCommand.ExecuteScalarAsync();

            highestBid = result == null || result == DBNull.Value
                ? null
                : Convert.ToDecimal(result);
        }

        // 7. Calculate the minimum acceptable bid.
        decimal requiredAmount = highestBid == null
            ? startingPrice
            : highestBid.Value + minimumIncrement;

        if (amount < requiredAmount)
        {
            throw new InvalidOperationException(
                $"Bid must be at least {requiredAmount:N2}.");
        }

        // 8. Insert the accepted bid.
        const string insertSql = """
            INSERT INTO bids
                (lot_id, bidder_id, amount, request_id)
            VALUES
                (@lotId, @bidderId, @amount, @requestId);

            SELECT LAST_INSERT_ID();
            """;

        int newBidId;

        await using (var insertCommand =
            new MySqlCommand(insertSql, connection, transaction))
        {
            insertCommand.Parameters.AddWithValue("@lotId", lotId);
            insertCommand.Parameters.AddWithValue("@bidderId", bidderId);
            insertCommand.Parameters.AddWithValue("@amount", amount);
            insertCommand.Parameters.AddWithValue(
                "@requestId", requestId.ToString());

            var result = await insertCommand.ExecuteScalarAsync();
            newBidId = Convert.ToInt32(result);
        }

        await transaction.CommitAsync();


        return new BidResponse
        {
            BidId = newBidId,
            LotId = lotId,
            BidderId = bidderId,
            BidderName = bidderName,
            Amount = amount,
            PlacedAt = DateTime.Now
        };
    }

    // Get bid history for a specific lot.
    public async Task<List<BidResponse>> GetBidHistoryAsync(int lotId)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        const string sql = """
            SELECT
                b.bid_id,
                b.lot_id,
                b.bidder_id,
                u.full_name AS bidder_name,
                b.amount,
                b.placed_at
            FROM bids b
            INNER JOIN users u ON u.user_id = b.bidder_id
            WHERE b.lot_id = @lotId
            ORDER BY b.placed_at DESC, b.bid_id DESC;
            """;

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@lotId", lotId);

        var bids = new List<BidResponse>();

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            bids.Add(new BidResponse
            {
                BidId = reader.GetInt32("bid_id"),
                LotId = reader.GetInt32("lot_id"),
                BidderId = reader.GetInt32("bidder_id"),
                BidderName = reader.GetString("bidder_name"),
                Amount = reader.GetDecimal("amount"),
                PlacedAt = reader.GetDateTime("placed_at")
            });
        }

        return bids;
    }
}

