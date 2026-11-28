using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleAuction.Api.Services;
using MySqlConnector;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionService _service;

    public AuctionsController(AuctionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var auctions = await _service.GetAuctionsAsync(status);
        return Ok(auctions);
    }
        [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var details = await _service.GetAuctionAsync(id);
        if (details == null)
            return NotFound(new { message = $"Auction {id} not found." });
        return Ok(details);
    }
    private bool TryGetCurrentUserId(out int userId) =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);

        [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] DTOs.CreateAuctionRequest request)
    {
        if (!TryGetCurrentUserId(out var adminId))
            return Unauthorized(new { message = "Unable to identify the logged-in admin." });

        try
        {
            var newId = await _service.CreateAuctionAsync(request, adminId);
            var created = await _service.GetAuctionAsync(newId);
            return CreatedAtAction(nameof(GetById), new { id = newId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
        [HttpPost("{id:int}/publish")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Publish(int id)
    {
        if (!TryGetCurrentUserId(out var adminId))
            return Unauthorized(new { message = "Unable to identify the logged-in admin." });

        try
        {
            await _service.PublishAuctionAsync(id, adminId);
            var updated = await _service.GetAuctionAsync(id);
            return Ok(updated);
        }
        catch (MySqlConnector.MySqlException ex) when (ex.SqlState == "45000")
        {
            var message = ex.Message;
            if (message.Contains("not found"))
                return NotFound(new { message });
            return BadRequest(new { message });
        }
    }
    [HttpPost("{id:int}/cancel")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Cancel(int id)
    {
        if (!TryGetCurrentUserId(out var adminId))
            return Unauthorized(new { message = "Unable to identify the logged-in admin." });

        try
        {
            await _service.CancelAuctionAsync(id, adminId);
            var updated = await _service.GetAuctionAsync(id);
            return Ok(updated);
        }
        catch (MySqlConnector.MySqlException ex) when (ex.SqlState == "45000")
        {
            var message = ex.Message;
            if (message.Contains("not found"))
                return NotFound(new { message });
            return BadRequest(new { message });
        }
    }
    [HttpGet("{id:int}/report")]
public async Task<IActionResult> GetReport(int id)
{
    var report = await _service.GetReportAsync(id);
    return report is null
        ? NotFound(new { message = $"Auction {id} not found." })
        : Ok(report);
}
}