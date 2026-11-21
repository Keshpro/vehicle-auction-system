
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/consignors")]
public class ConsignorsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ConsignorsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // GET: api/consignors
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

        var consignors = new List<object>();

        await using var connection =
            new MySqlConnection(connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                consignor_id,
                name,
                phone,
                email,
                address
            FROM consignors
            ORDER BY name ASC;
            """;

        await using var command =
            new MySqlCommand(sql, connection);

        await using var reader =
            await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            consignors.Add(new
            {
                consignorId =
                    reader.GetInt32("consignor_id"),

                name = reader.GetString("name"),

                phone =
                    reader.IsDBNull(reader.GetOrdinal("phone"))
                        ? null
                        : reader.GetString("phone"),

                email =
                    reader.IsDBNull(reader.GetOrdinal("email"))
                        ? null
                        : reader.GetString("email"),

                address =
                    reader.IsDBNull(reader.GetOrdinal("address"))
                        ? null
                        : reader.GetString("address")
            });
        }

        return Ok(consignors);
    }
}
