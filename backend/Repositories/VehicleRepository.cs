
using MySqlConnector;
using VehicleAuction.Api.DTOs;
using VehicleAuction.Api.Models;

namespace VehicleAuction.Api.Repositories;

public class VehicleRepository
{
    private readonly string _connectionString;

    public VehicleRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString(
            "DefaultConnection"
        ) ?? throw new InvalidOperationException(
            "Database connection string is missing."
        );
    }

    // READ ALL VEHICLES
    public async Task<List<Vehicle>> GetAllAsync()
    {
        var vehicles = new List<Vehicle>();

        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                vehicle_id,
                consignor_id,
                yard_location_id,
                registration_number,
                chassis_number,
                make,
                model,
                manufacture_year,
                colour,
                mileage_km,
                fuel_type,
                transmission,
                description,
                created_at
            FROM vehicles
            ORDER BY vehicle_id DESC;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        await using var reader =
            await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            vehicles.Add(MapVehicle(reader));
        }

        return vehicles;
    }

    // READ VEHICLE BY ID
    public async Task<Vehicle?> GetByIdAsync(int id)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                vehicle_id,
                consignor_id,
                yard_location_id,
                registration_number,
                chassis_number,
                make,
                model,
                manufacture_year,
                colour,
                mileage_km,
                fuel_type,
                transmission,
                description,
                created_at
            FROM vehicles
            WHERE vehicle_id = @VehicleId;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@VehicleId", id);

        await using var reader =
            await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapVehicle(reader);
        }

        return null;
    }

    // CREATE VEHICLE
    public async Task<int> CreateAsync(VehicleRequestDto vehicle)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            INSERT INTO vehicles (
                consignor_id,
                yard_location_id,
                registration_number,
                chassis_number,
                make,
                model,
                manufacture_year,
                colour,
                mileage_km,
                fuel_type,
                transmission,
                description
            )
            VALUES (
                @ConsignorId,
                @YardLocationId,
                @RegistrationNumber,
                @ChassisNumber,
                @Make,
                @Model,
                @ManufactureYear,
                @Colour,
                @MileageKm,
                @FuelType,
                @Transmission,
                @Description
            );
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        AddVehicleParameters(command, vehicle);

        await command.ExecuteNonQueryAsync();

        return checked((int)command.LastInsertedId);
    }

    // UPDATE VEHICLE
    public async Task<bool> UpdateAsync(
        int id,
        VehicleRequestDto vehicle
    )
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            UPDATE vehicles
            SET
                consignor_id = @ConsignorId,
                yard_location_id = @YardLocationId,
                registration_number = @RegistrationNumber,
                chassis_number = @ChassisNumber,
                make = @Make,
                model = @Model,
                manufacture_year = @ManufactureYear,
                colour = @Colour,
                mileage_km = @MileageKm,
                fuel_type = @FuelType,
                transmission = @Transmission,
                description = @Description
            WHERE vehicle_id = @VehicleId;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        AddVehicleParameters(command, vehicle);

        command.Parameters.AddWithValue("@VehicleId", id);

        var affectedRows = await command.ExecuteNonQueryAsync();

        return affectedRows > 0;
    }

    // DELETE VEHICLE
    public async Task<bool> DeleteAsync(int id)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            DELETE FROM vehicles
            WHERE vehicle_id = @VehicleId;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@VehicleId", id);

        var affectedRows = await command.ExecuteNonQueryAsync();

        return affectedRows > 0;
    }

    // ADD SQL PARAMETERS
    private static void AddVehicleParameters(
        MySqlCommand command,
        VehicleRequestDto vehicle
    )
    {
        command.Parameters.AddWithValue(
            "@ConsignorId", vehicle.ConsignorId
        );

        command.Parameters.AddWithValue(
            "@YardLocationId", vehicle.YardLocationId
        );

        command.Parameters.AddWithValue(
            "@RegistrationNumber",
            (object?)vehicle.RegistrationNumber ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@ChassisNumber", vehicle.ChassisNumber
        );

        command.Parameters.AddWithValue(
            "@Make", vehicle.Make
        );

        command.Parameters.AddWithValue(
            "@Model", vehicle.Model
        );

        command.Parameters.AddWithValue(
            "@ManufactureYear", vehicle.ManufactureYear
        );

        command.Parameters.AddWithValue(
            "@Colour",
            (object?)vehicle.Colour ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@MileageKm",
            (object?)vehicle.MileageKm ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@FuelType",
            (object?)vehicle.FuelType ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@Transmission",
            (object?)vehicle.Transmission ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@Description",
            (object?)vehicle.Description ?? DBNull.Value
        );
    }

    // CONVERT MYSQL ROW TO VEHICLE MODEL
    private static Vehicle MapVehicle(
        MySqlDataReader reader
    )
    {
        return new Vehicle
        {
            VehicleId = reader.GetInt32("vehicle_id"),

            ConsignorId = reader.GetInt32("consignor_id"),

            YardLocationId = reader.GetInt32("yard_location_id"),

            RegistrationNumber =
                reader.IsDBNull(reader.GetOrdinal("registration_number"))
                    ? null
                    : reader.GetString("registration_number"),

            ChassisNumber = reader.GetString("chassis_number"),

            Make = reader.GetString("make"),

            Model = reader.GetString("model"),

            ManufactureYear = reader.GetInt32("manufacture_year"),

            Colour =
                reader.IsDBNull(reader.GetOrdinal("colour"))
                    ? null
                    : reader.GetString("colour"),

            MileageKm =
                reader.IsDBNull(reader.GetOrdinal("mileage_km"))
                    ? null
                    : reader.GetInt32("mileage_km"),

            FuelType =
                reader.IsDBNull(reader.GetOrdinal("fuel_type"))
                    ? null
                    : reader.GetString("fuel_type"),

            Transmission =
                reader.IsDBNull(reader.GetOrdinal("transmission"))
                    ? null
                    : reader.GetString("transmission"),

            Description =
                reader.IsDBNull(reader.GetOrdinal("description"))
                    ? null
                    : reader.GetString("description"),

            CreatedAt = reader.GetDateTime("created_at")
        };
    }
}
