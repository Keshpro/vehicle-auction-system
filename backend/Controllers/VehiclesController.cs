using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/vehicles")]
public class VehiclesController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public VehiclesController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = """
            SELECT vehicle_id, make, model, manufacture_year
            FROM vehicles
            ORDER BY vehicle_id;
            """;

        await using var command = new MySqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync();

        var vehicles = new List<object>();

        while (await reader.ReadAsync())
        {
            vehicles.Add(new
            {
                vehicleId = reader.GetInt32("vehicle_id"),
                make = reader.GetString("make"),
                model = reader.GetString("model"),
                manufactureYear = reader.GetInt32("manufacture_year")
            });
        }

        return Ok(vehicles);
    }
}