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
        [HttpPost]
    public async Task<IActionResult> Create([FromBody] DTOs.CreateAuctionRequest request)
    {
        try
        {
            var newId = await _service.CreateAuctionAsync(request);
            var created = await _service.GetAuctionAsync(newId);
            return CreatedAtAction(nameof(GetById), new { id = newId }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
        [HttpPost("{id:int}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        try
        {
            await _service.PublishAuctionAsync(id);
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