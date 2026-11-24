
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VehicleAuction.Api.DTOs;
using VehicleAuction.Api.Services;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Route("api/lots/{lotId:int}/bids")]
[Authorize(Roles = "Bidder")]
public class BidsController : ControllerBase
{
    private readonly BidService _bidService;

    public BidsController(BidService bidService)
    {
        _bidService = bidService;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceBid(
        int lotId,
        [FromBody] PlaceBidRequest request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int bidderId))
        {
            return Unauthorized(new
            {
                message = "Unable to identify the logged-in bidder."
            });
        }

        try
        {
            var result = await _bidService.PlaceBidAsync(
                lotId,
                bidderId,
                request);

            return Ok(new
            {
                message = "Bid placed successfully!",
                bid = result
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (MySqlConnector.MySqlException ex)
            when (ex.Number == 1062)
        {
            return Conflict(new
            {
                message = "This bid request has already been processed."
            });
        }
    }
}
