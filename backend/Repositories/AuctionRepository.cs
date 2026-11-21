using MySqlConnector;
using VehicleAuction.Api.Models;

namespace VehicleAuction.Api.Repositories;

public class AuctionRepository
{
    private readonly string _connectionString;

    public AuctionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection is not configured.");
    }

    public async Task<List<Auction>> GetAllAsync(string? status)
    {
        var auctions = new List<Auction>();

        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"SELECT auction_id, title, description, starts_at, ends_at,
                           status, created_by, created_at
                    FROM auctions
                    WHERE (@status IS NULL OR status = @status)
                    ORDER BY starts_at";

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@status", (object?)status ?? DBNull.Value);

        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            auctions.Add(new Auction
            {
                AuctionId = reader.GetInt32("auction_id"),
                Title = reader.GetString("title"),
                Description = reader.IsDBNull(reader.GetOrdinal("description"))
                    ? null : reader.GetString("description"),
                StartsAt = reader.GetDateTime("starts_at"),
                EndsAt = reader.GetDateTime("ends_at"),
                Status = reader.GetString("status"),
                CreatedBy = reader.GetInt32("created_by"),
                CreatedAt = reader.GetDateTime("created_at")
            });
        }

        return auctions;
    }
        public async Task<AuctionDetails?> GetByIdAsync(int id)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        Auction? auction = null;

        var auctionSql = @"SELECT auction_id, title, description, starts_at, ends_at,
                                  status, created_by, created_at
                           FROM auctions WHERE auction_id = @id";

        await using (var cmd = new MySqlCommand(auctionSql, connection))
        {
            cmd.Parameters.AddWithValue("@id", id);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                auction = new Auction
                {
                    AuctionId = reader.GetInt32("auction_id"),
                    Title = reader.GetString("title"),
                    Description = reader.IsDBNull(reader.GetOrdinal("description"))
                        ? null : reader.GetString("description"),
                    StartsAt = reader.GetDateTime("starts_at"),
                    EndsAt = reader.GetDateTime("ends_at"),
                    Status = reader.GetString("status"),
                    CreatedBy = reader.GetInt32("created_by"),
                    CreatedAt = reader.GetDateTime("created_at")
                };
            }
        }

        if (auction == null) return null;

        var details = new AuctionDetails { Auction = auction };

        var lotsSql = @"SELECT l.lot_id, l.lot_number, l.vehicle_id, v.make, v.model,
                               v.manufacture_year, l.starting_price, l.minimum_increment,
                               l.bidding_starts_at, l.bidding_ends_at, l.status
                        FROM vehicle_lots l
                        JOIN vehicles v ON v.vehicle_id = l.vehicle_id
                        WHERE l.auction_id = @id
                        ORDER BY l.lot_number";

        await using (var cmd = new MySqlCommand(lotsSql, connection))
        {
            cmd.Parameters.AddWithValue("@id", id);
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                details.Lots.Add(new AuctionLot
                {
                    LotId = reader.GetInt32("lot_id"),
                    LotNumber = reader.GetInt32("lot_number"),
                    VehicleId = reader.GetInt32("vehicle_id"),
                    Make = reader.GetString("make"),
                    Model = reader.GetString("model"),
                    ManufactureYear = reader.GetInt32("manufacture_year"),
                    StartingPrice = reader.GetDecimal("starting_price"),
                    MinimumIncrement = reader.GetDecimal("minimum_increment"),
                    BiddingStartsAt = reader.GetDateTime("bidding_starts_at"),
                    BiddingEndsAt = reader.GetDateTime("bidding_ends_at"),
                    Status = reader.GetString("status")
                });
            }
        }

        return details;
    }
        public async Task<int> CreateAsync(string title, string? description,
        DateTime startsAt, DateTime endsAt, int createdBy)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"INSERT INTO auctions (title, description, starts_at, ends_at, status, created_by)
                    VALUES (@title, @description, @startsAt, @endsAt, 'Draft', @createdBy);
                    SELECT LAST_INSERT_ID();";

        await using var cmd = new MySqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@title", title);
        cmd.Parameters.AddWithValue("@description", (object?)description ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@startsAt", startsAt);
        cmd.Parameters.AddWithValue("@endsAt", endsAt);
        cmd.Parameters.AddWithValue("@createdBy", createdBy);

        var newId = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(newId);
    }
}