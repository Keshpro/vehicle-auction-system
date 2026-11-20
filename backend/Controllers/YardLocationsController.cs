
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/yard-locations")]
public class YardLocationsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public YardLocationsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // GET: api/yard-locations
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return StatusCode(500, new
            {
                message = "Database connection is not configured."
            });
        }

        var locations = new List<object>();

        await using var connection =
            new MySqlConnection(connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                yard_location_id,
                location_name,
                address
            FROM yard_locations
            ORDER BY location_name ASC;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        await using var reader =
            await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            locations.Add(new
            {
                yardLocationId =
                    reader.GetInt32("yard_location_id"),

                locationName =
                    reader.GetString("location_name"),

                address =
                    reader.IsDBNull(reader.GetOrdinal("address"))
                        ? null
                        : reader.GetString("address")
            });
        }

        return Ok(locations);
    }
}
