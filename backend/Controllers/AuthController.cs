using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using MySqlConnector;
using System.ComponentModel.DataAnnotations;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly string _connectionString;

    private readonly PasswordHasher<object> _passwordHasher = new();

    public AuthController(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Database connection string is missing.");
    }

    [HttpDelete("session")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    // Registration request data
    public class RegisterRequest
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";

        public string? Phone { get; set; }

        public string? Address { get; set; }
    }

    // REGISTER A NEW BIDDER
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request)
    {
        string email = request.Email.Trim().ToLowerInvariant();

        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        // Check whether email already exists
        const string checkSql = """
            SELECT COUNT(*)
            FROM users
            WHERE email = @email
            """;

        await using (var checkCommand =
            new MySqlCommand(checkSql, connection))
        {
            checkCommand.Parameters.AddWithValue("@email", email);

            var count = Convert.ToInt32(
                await checkCommand.ExecuteScalarAsync());

            if (count > 0)
            {
                return Conflict(new
                {
                    message = "Email is already registered."
                });
            }
        }

        // Hash the password before saving it
        string passwordHash =
            _passwordHasher.HashPassword(
                new object(), request.Password);

        await using var transaction =
            await connection.BeginTransactionAsync();

        try
        {
            // STEP 1: Create the user
            const string insertUserSql = """
                INSERT INTO users
                (full_name, email, password_hash, phone, account_status)
                VALUES
                (@name, @email, @password, @phone, 'Active')
                """;

            await using var userCommand =
                new MySqlCommand(
                    insertUserSql, connection, transaction);

            userCommand.Parameters.AddWithValue(
                "@name", request.FullName.Trim());

            userCommand.Parameters.AddWithValue(
                "@email", email);

            userCommand.Parameters.AddWithValue(
                "@password", passwordHash);

            userCommand.Parameters.AddWithValue(
                "@phone",
                (object?)request.Phone ?? DBNull.Value);

            await userCommand.ExecuteNonQueryAsync();

            long userId = userCommand.LastInsertedId;

            // STEP 2: Assign the Bidder role
            const string roleSql = """
                INSERT INTO user_roles (user_id, role_id)
                SELECT @userId, role_id
                FROM roles
                WHERE role_name = 'Bidder'
                """;

            await using var roleCommand =
                new MySqlCommand(
                    roleSql, connection, transaction);

            roleCommand.Parameters.AddWithValue(
                "@userId", userId);

            int roleRows =
                await roleCommand.ExecuteNonQueryAsync();

            if (roleRows != 1)
            {
                throw new InvalidOperationException(
                    "Bidder role was not found.");
            }

            // STEP 3: Create Pending bidder profile
            const string profileSql = """
                INSERT INTO bidder_profiles
                (user_id, address, approval_status)
                VALUES
                (@userId, @address, 'Pending')
                """;

            await using var profileCommand =
                new MySqlCommand(
                    profileSql, connection, transaction);

            profileCommand.Parameters.AddWithValue(
                "@userId", userId);

            profileCommand.Parameters.AddWithValue(
                "@address",
                (object?)request.Address ?? DBNull.Value);

            await profileCommand.ExecuteNonQueryAsync();

            // Save all changes together
            await transaction.CommitAsync();

            return StatusCode(201, new
            {
                message = "Registration successful!",
                userId,
                role = "Bidder",
                approvalStatus = "Pending"
            });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Email is already registered."
            });
        }
        catch
        {
            await transaction.RollbackAsync();

            return StatusCode(500, new
            {
                message = "Registration failed. Please try again."
            });
        }
    }
    // LOGIN REQUEST DATA
public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";
}

// LOGIN API
[HttpPost("login")]
public async Task<IActionResult> Login(
    [FromBody] LoginRequest request)
{
    string email = request.Email.Trim().ToLowerInvariant();

    await using var connection =
        new MySqlConnection(_connectionString);

    await connection.OpenAsync();

    const string sql = """
        SELECT
            u.user_id,
            u.full_name,
            u.email,
            u.password_hash,
            u.account_status,
            r.role_name,
            bp.approval_status
        FROM users u
        JOIN user_roles ur
            ON u.user_id = ur.user_id
        JOIN roles r
            ON ur.role_id = r.role_id
        LEFT JOIN bidder_profiles bp
            ON u.user_id = bp.user_id
        WHERE u.email = @email
          AND r.role_name IN ('Admin', 'Bidder')
        ORDER BY CASE WHEN r.role_name = 'Admin' THEN 0 ELSE 1 END
        LIMIT 1
        """;

    await using var command =
        new MySqlCommand(sql, connection);

    command.Parameters.AddWithValue("@email", email);

    await using var reader = await command.ExecuteReaderAsync();

    if (!await reader.ReadAsync())
    {
        return Unauthorized(new
        {
            message = "Invalid email or password."
        });
    }

    int userId = reader.GetInt32("user_id");
    string fullName = reader.GetString("full_name");
    string userEmail = reader.GetString("email");
    string passwordHash = reader.GetString("password_hash");
    string accountStatus = reader.GetString("account_status");
    string role = reader.GetString("role_name");

    string approvalStatus =
        reader.IsDBNull(reader.GetOrdinal("approval_status"))
            ? "Not Applicable"
            : reader.GetString("approval_status");

    if (passwordHash == "DEMO_ONLY_NO_LOGIN")
    {
        return Unauthorized(new { message = "This account is inactive." });
    }

    var verificationResult =
        _passwordHasher.VerifyHashedPassword(
            new object(),
            passwordHash,
            request.Password);

    if (verificationResult == PasswordVerificationResult.Failed)
    {
        return Unauthorized(new
        {
            message = "Invalid email or password."
        });
    }

    if (accountStatus != "Active")
    {
        return Unauthorized(new
        {
            message = "This account is inactive."
        });
    }

    // Create login claims
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Name, fullName),
        new Claim(ClaimTypes.Email, userEmail),
        new Claim(ClaimTypes.Role, role)
    };

    var identity = new ClaimsIdentity(
        claims,
        CookieAuthenticationDefaults.AuthenticationScheme);

    var principal = new ClaimsPrincipal(identity);

    // Create authentication cookie
    await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        principal);

    return Ok(new
    {
        message = "Login successful!",
        userId,
        fullName,
        email = userEmail,
        role,
        approvalStatus
    });
}
}