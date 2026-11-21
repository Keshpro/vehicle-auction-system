
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using VehicleAuction.Api.Repositories;

namespace VehicleAuction.Api.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId:int}/photos")]
public class VehiclePhotosController : ControllerBase
{
    private readonly VehiclePhotoRepository _repository;

    public VehiclePhotosController(
        VehiclePhotoRepository repository)
    {
        _repository = repository;
    }

    // GET: api/vehicles/1/photos
    [HttpGet]
    public async Task<IActionResult> GetPhotos(int vehicleId)
    {
        if (vehicleId <= 0)
            return BadRequest(new { message = "Invalid vehicle ID." });

        var photos = await _repository.GetByVehicleIdAsync(vehicleId);

        return Ok(photos);
    }

    // POST: api/vehicles/1/photos
    [HttpPost]
    public async Task<IActionResult> AddPhoto(
        int vehicleId,
        [FromBody] AddVehiclePhotoRequest request)
    {
        if (vehicleId <= 0)
            return BadRequest(new { message = "Invalid vehicle ID." });

        if (string.IsNullOrWhiteSpace(request.PhotoUrl) ||
            request.PhotoUrl.Length > 500 ||
            !Uri.TryCreate(request.PhotoUrl, UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttps &&
             uri.Scheme != Uri.UriSchemeHttp))
        {
            return BadRequest(new
            {
                message = "A valid HTTP or HTTPS photo URL is required (maximum 500 characters)."
            });
        }

        if (request.DisplayOrder < 0)
            return BadRequest(new { message = "Display order cannot be negative." });

        try
        {
            var photoId = await _repository.AddAsync(
                vehicleId,
                request.PhotoUrl.Trim(),
                request.IsCover,
                request.DisplayOrder);

            return CreatedAtAction(
                nameof(GetPhotos),
                new { vehicleId },
                new
                {
                    photoId,
                    vehicleId,
                    message = "Vehicle photo added successfully."
                });
        }
        catch (MySqlException ex) when (ex.Number == 1452)
        {
            return NotFound(new
            {
                message = "Vehicle does not exist."
            });
        }
    }

    // PUT: api/vehicles/1/photos/5/cover
    [HttpPut("{photoId:int}/cover")]
    public async Task<IActionResult> SetCover(
        int vehicleId,
        int photoId)
    {
        var updated = await _repository.SetCoverAsync(
            vehicleId, photoId);

        if (!updated)
            return NotFound(new
            {
                message = "Vehicle photo not found."
            });

        return Ok(new
        {
            message = "Cover photo updated successfully."
        });
    }

    // DELETE: api/vehicles/1/photos/5
    [HttpDelete("{photoId:int}")]
    public async Task<IActionResult> DeletePhoto(
        int vehicleId,
        int photoId)
    {
        var deleted = await _repository.DeleteAsync(
            vehicleId, photoId);

        if (!deleted)
            return NotFound(new
            {
                message = "Vehicle photo not found."
            });

        return Ok(new
        {
            message = "Vehicle photo deleted successfully."
        });
    }
}

public sealed class AddVehiclePhotoRequest
{
    public string PhotoUrl { get; set; } = string.Empty;

    public bool IsCover { get; set; }

    public int DisplayOrder { get; set; }
}
