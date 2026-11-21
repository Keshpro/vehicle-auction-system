
using MySqlConnector;
using VehicleAuction.Api.Models;

namespace VehicleAuction.Api.Repositories;

public class VehiclePhotoRepository
{
    private readonly string _connectionString;

    public VehiclePhotoRepository(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Database connection string is missing.");
    }

    // GET ALL PHOTOS FOR A VEHICLE
    public async Task<List<VehiclePhoto>> GetByVehicleIdAsync(int vehicleId)
    {
        var photos = new List<VehiclePhoto>();

        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT photo_id, vehicle_id, photo_url,
                   is_cover, display_order
            FROM vehicle_photos
            WHERE vehicle_id = @VehicleId
            ORDER BY is_cover DESC, display_order ASC, photo_id ASC;
            """;

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@VehicleId", vehicleId);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            photos.Add(new VehiclePhoto
            {
                PhotoId = reader.GetInt32("photo_id"),
                VehicleId = reader.GetInt32("vehicle_id"),
                PhotoUrl = reader.GetString("photo_url"),
                IsCover = reader.GetBoolean("is_cover"),
                DisplayOrder = reader.GetInt32("display_order")
            });
        }

        return photos;
    }

    // ADD PHOTO URL TO VEHICLE
    public async Task<int> AddAsync(
        int vehicleId,
        string photoUrl,
        bool isCover,
        int displayOrder)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        await using var transaction =
            await connection.BeginTransactionAsync();

        if (isCover)
        {
            const string resetCoverSql = """
                UPDATE vehicle_photos
                SET is_cover = FALSE
                WHERE vehicle_id = @VehicleId;
                """;

            await using var resetCommand =
                new MySqlCommand(resetCoverSql, connection, transaction);

            resetCommand.Parameters.AddWithValue("@VehicleId", vehicleId);

            await resetCommand.ExecuteNonQueryAsync();
        }

        const string insertSql = """
            INSERT INTO vehicle_photos
                (vehicle_id, photo_url, is_cover, display_order)
            VALUES
                (@VehicleId, @PhotoUrl, @IsCover, @DisplayOrder);
            """;

        await using var command =
            new MySqlCommand(insertSql, connection, transaction);

        command.Parameters.AddWithValue("@VehicleId", vehicleId);
        command.Parameters.AddWithValue("@PhotoUrl", photoUrl);
        command.Parameters.AddWithValue("@IsCover", isCover);
        command.Parameters.AddWithValue("@DisplayOrder", displayOrder);

        await command.ExecuteNonQueryAsync();

        var photoId = checked((int)command.LastInsertedId);

        await transaction.CommitAsync();

        return photoId;
    }

    // SET EXISTING PHOTO AS COVER
    public async Task<bool> SetCoverAsync(int vehicleId, int photoId)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        await using var transaction =
            await connection.BeginTransactionAsync();

        const string existsSql = """
            SELECT COUNT(*)
            FROM vehicle_photos
            WHERE photo_id = @PhotoId
              AND vehicle_id = @VehicleId;
            """;

        await using var existsCommand =
            new MySqlCommand(existsSql, connection, transaction);

        existsCommand.Parameters.AddWithValue("@PhotoId", photoId);
        existsCommand.Parameters.AddWithValue("@VehicleId", vehicleId);

        var exists = Convert.ToInt32(
            await existsCommand.ExecuteScalarAsync()) > 0;

        if (!exists)
        {
            await transaction.RollbackAsync();
            return false;
        }

        const string resetSql = """
            UPDATE vehicle_photos
            SET is_cover = FALSE
            WHERE vehicle_id = @VehicleId;
            """;

        await using var resetCommand =
            new MySqlCommand(resetSql, connection, transaction);

        resetCommand.Parameters.AddWithValue("@VehicleId", vehicleId);

        await resetCommand.ExecuteNonQueryAsync();

        const string setCoverSql = """
            UPDATE vehicle_photos
            SET is_cover = TRUE
            WHERE photo_id = @PhotoId
              AND vehicle_id = @VehicleId;
            """;

        await using var coverCommand =
            new MySqlCommand(setCoverSql, connection, transaction);

        coverCommand.Parameters.AddWithValue("@PhotoId", photoId);
        coverCommand.Parameters.AddWithValue("@VehicleId", vehicleId);

        await coverCommand.ExecuteNonQueryAsync();

        await transaction.CommitAsync();

        return true;
    }

    // DELETE VEHICLE PHOTO
    public async Task<bool> DeleteAsync(int vehicleId, int photoId)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            DELETE FROM vehicle_photos
            WHERE photo_id = @PhotoId
              AND vehicle_id = @VehicleId;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@PhotoId", photoId);
        command.Parameters.AddWithValue("@VehicleId", vehicleId);

        return await command.ExecuteNonQueryAsync() > 0;
    }
}
