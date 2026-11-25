using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using VehicleAuction.Api.DTOs;
using VehicleAuction.Api.Repositories;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[Route("api/admin")]
public sealed class Member02ReportingController(
    IConfiguration configuration, ILogger<Member02ReportingController> logger) : ControllerBase
{
    [HttpGet("reports")]
    public Task<IActionResult> GetReports(
        [FromQuery] Member02ReportQuery query, CancellationToken cancellationToken) =>
        ReadReportAsync(query, null, cancellationToken);

    [HttpPost("reports/generate")]
    public Task<IActionResult> GenerateReport(
        [FromBody] Member02ReportQuery query, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int actorId) || actorId <= 0)
        {
            return Task.FromResult<IActionResult>(Forbid());
        }

        return ReadReportAsync(query, actorId, cancellationToken);
    }

    [HttpGet("audit-logs")]
    public Task<IActionResult> GetAuditLogs(
        [FromQuery] Member02AuditQuery query, CancellationToken cancellationToken)
    {
        if (!ValidateDates(query.From, query.To))
        {
            return Task.FromResult<IActionResult>(ValidationProblem(ModelState));
        }

        return ReadDatabaseAsync(repository => repository.ReadAuditLogsAsync(query, cancellationToken));
    }

    private Task<IActionResult> ReadReportAsync(
        Member02ReportQuery query, int? actorId, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var to = query.To ?? today.AddDays(1);
        var from = query.From ?? (to.DayNumber >= 30 ? to.AddDays(-30) : DateOnly.MinValue);

        if (!ValidateDates(from, to))
        {
            return Task.FromResult<IActionResult>(ValidationProblem(ModelState));
        }

        return ReadDatabaseAsync(repository =>
            repository.ReadReportAsync(query, from, to, actorId, cancellationToken));
    }

    private bool ValidateDates(DateOnly? from, DateOnly? to)
    {
        var earliest = new DateOnly(1000, 1, 1);
        if (from < earliest || to < earliest)
        {
            ModelState.AddModelError("dateRange", "Dates must be on or after 1000-01-01.");
        }
        else if (from.HasValue && to.HasValue && from >= to)
        {
            ModelState.AddModelError("to", "The exclusive end date must be after the start date.");
        }

        return ModelState.IsValid;
    }

    private async Task<IActionResult> ReadDatabaseAsync<T>(
        Func<Member02ReportingRepository, Task<T>> operation)
    {
        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            logger.LogError("The reporting database connection is missing.");
            return Problem(statusCode: 503, title: "The reporting database is unavailable.");
        }

        try
        {
            return Ok(await operation(new Member02ReportingRepository(connectionString)));
        }
        catch (ArgumentException)
        {
            logger.LogError("The reporting database connection configuration is invalid.");
            return Problem(statusCode: 503, title: "The reporting database is unavailable.");
        }
        catch (MySqlException exception) when (!HttpContext.RequestAborted.IsCancellationRequested)
        {
            logger.LogError("Member 02 database operation failed with MySQL error {ErrorNumber}.",
                exception.Number);
            return Problem(statusCode: 503, title: "The reporting database operation failed.");
        }
    }
}
