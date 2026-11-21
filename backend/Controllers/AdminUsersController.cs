using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Authorize(Roles = "Admin")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[Route("api/admin/users")]
public class AdminUsersController : ControllerBase
{
    private readonly IConfiguration _configuration;
    public AdminUsersController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("session")]
    public IActionResult GetSession()
    {
        return Ok(new { fullName = User.Identity?.Name });
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        const string sql = """
            SELECT u.user_id, u.full_name, u.email, r.role_name, u.account_status
            FROM users AS u
            LEFT JOIN user_roles AS ur ON u.user_id = ur.user_id
            LEFT JOIN roles AS r ON ur.role_id = r.role_id
            ORDER BY u.user_id, r.role_name;
            """;

        await using var command = new MySqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        var users = new List<object>();
        var roleColumn = reader.GetOrdinal("role_name");

        while (await reader.ReadAsync(cancellationToken))
        {
            users.Add(new
            {
                userId = reader.GetInt32("user_id"),
                fullName = reader.GetString("full_name"),
                email = reader.GetString("email"),
                roleName = reader.IsDBNull(roleColumn) ? null : reader.GetString(roleColumn),
                accountStatus = reader.GetString("account_status")
            });
        }

        return Ok(users);
    }

    [HttpGet("pending-bidders")]
    public async Task<IActionResult> GetPendingBidders(
        CancellationToken cancellationToken)
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        const string sql = """
            SELECT u.user_id, u.full_name, u.email, bp.approval_status
            FROM bidder_profiles AS bp
            JOIN users AS u ON u.user_id = bp.user_id
            WHERE bp.approval_status = 'Pending'
            ORDER BY u.user_id;
            """;

        await using var command = new MySqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        var bidders = new List<object>();

        while (await reader.ReadAsync(cancellationToken))
        {
            bidders.Add(new
            {
                userId = reader.GetInt32("user_id"),
                fullName = reader.GetString("full_name"),
                email = reader.GetString("email"),
                approvalStatus = reader.GetString("approval_status")
            });
        }

        return Ok(bidders);
    }

    [HttpPut("{userId:int}/approval")]
    public async Task<IActionResult> ApproveBidder(
        int userId, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var adminId))
        {
            return Forbid();
        }

        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        const string sql = """
            UPDATE bidder_profiles
            SET approval_status = 'Approved',
                approved_by = @adminId,
                approved_at = NOW()
            WHERE user_id = @userId AND approval_status = 'Pending';
            """;

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@adminId", adminId);

        var rowsUpdated = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsUpdated == 0)
        {
            return Conflict(new { message = "The bidder is no longer pending or could not be found." });
        }

        return Ok(new { userId, approvalStatus = "Approved" });
    }
}
