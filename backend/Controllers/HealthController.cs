using Microsoft.AspNetCore.Mvc;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", service = "Vehicle Auction API" });
}
