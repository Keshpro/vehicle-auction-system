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
}