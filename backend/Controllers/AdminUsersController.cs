using System.Net;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/admin/users")]
public class AdminUsersController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AdminUsersController(
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _environment = environment;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
    {
            // Local testing while the team's admin login is being built.
            if (!IsLocalDevelopmentRequest())
    {
        return NotFound();
    }

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
        if (!IsLocalDevelopmentRequest())
        {
            return NotFound();
        }

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
        if (!IsLocalDevelopmentRequest())
        {
            return NotFound();
        }

        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        const string sql = """
            UPDATE bidder_profiles AS bp
            JOIN users AS bidder ON bidder.user_id = bp.user_id
            JOIN users AS approver ON approver.email = 'admin@example.com'
            SET bp.approval_status = 'Approved',
                bp.approved_by = approver.user_id,
                bp.approved_at = NOW()
            WHERE bp.user_id = @userId
              AND bidder.email = 'bidder@example.com'
              AND bp.approval_status = 'Pending';
            """;

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);

        var rowsUpdated = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rowsUpdated == 0)
        {
            return Conflict(new { message = "The demo bidder is no longer pending or could not be found." });
        }

        return Ok(new { userId, approvalStatus = "Approved" });
    }
    private bool IsLocalDevelopmentRequest()
    {
        return _environment.IsDevelopment()
            && HttpContext.Connection.RemoteIpAddress is { } remoteAddress
            && IPAddress.IsLoopback(remoteAddress);
    }
}