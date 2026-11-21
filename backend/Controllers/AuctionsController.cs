using Microsoft.AspNetCore.Mvc;
using VehicleAuction.Api.Services;

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
}