
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using VehicleAuction.Api.DTOs;
using VehicleAuction.Api.Repositories;

[ApiController]
[Route("api/vehicles")]
public class VehiclesController : ControllerBase
{
    private readonly VehicleRepository _repository;

    public VehiclesController(VehicleRepository repository)
    {
        _repository = repository;
    }

    // ==========================================
    // GET ALL VEHICLES
    // GET: api/vehicles
    // ==========================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _repository.GetAllAsync();

        return Ok(vehicles);
    }

    // ==========================================
    // SEARCH AND FILTER VEHICLES
    // GET: api/vehicles/search
    // ==========================================

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? make,
        [FromQuery] string? model,
        [FromQuery] string? fuelType,
        [FromQuery] int? minYear,
        [FromQuery] int? maxYear)
    {
        // Validate manufacture year range
        if (minYear.HasValue &&
            maxYear.HasValue &&
            minYear.Value > maxYear.Value)
        {
            return BadRequest(new
            {
                message = "Minimum year cannot exceed maximum year."
            });
        }

        // Validate year values
        if ((minYear.HasValue && minYear.Value < 1886) ||
            (maxYear.HasValue && maxYear.Value < 1886))
        {
            return BadRequest(new
            {
                message = "Invalid manufacture year."
            });
        }

        var vehicles = await _repository.SearchAsync(
            make,
            model,
            fuelType,
            minYear,
            maxYear
        );

        return Ok(vehicles);
    }

    // ==========================================
    // GET VEHICLE BY ID
    // GET: api/vehicles/1
    // ==========================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await _repository.GetByIdAsync(id);

        if (vehicle == null)
        {
            return NotFound(new
            {
                message = "Vehicle not found."
            });
        }

        return Ok(vehicle);
    }

    // ==========================================
    // CREATE VEHICLE
    // POST: api/vehicles
    // ==========================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] VehicleRequestDto request)
    {
        try
        {
            var vehicleId =
                await _repository.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = vehicleId },
                new
                {
                    vehicleId,
                    message = "Vehicle created successfully."
                }
            );
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            return Conflict(new
            {
                message = "Registration or chassis number already exists."
            });
        }
        catch (MySqlException ex) when (ex.Number == 1452)
        {
            return BadRequest(new
            {
                message = "Invalid consignor or yard location."
            });
        }
    }

    // ==========================================
    // UPDATE VEHICLE
    // PUT: api/vehicles/1
    // ==========================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] VehicleRequestDto request)
    {
        try
        {
            var vehicle = await _repository.GetByIdAsync(id);

            if (vehicle == null)
            {
                return NotFound(new
                {
                    message = "Vehicle not found."
                });
            }

            await _repository.UpdateAsync(id, request);

            return Ok(new
            {
                message = "Vehicle updated successfully."
            });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            return Conflict(new
            {
                message = "Registration or chassis number already exists."
            });
        }
        catch (MySqlException ex) when (ex.Number == 1452)
        {
            return BadRequest(new
            {
                message = "Invalid consignor or yard location."
            });
        }
    }

    // ==========================================
    // DELETE VEHICLE
    // DELETE: api/vehicles/1
    // ==========================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _repository.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Vehicle not found."
                });
            }

            return Ok(new
            {
                message = "Vehicle deleted successfully."
            });
        }
        catch (MySqlException ex) when (ex.Number == 1451)
        {
            return Conflict(new
            {
                message = "Vehicle cannot be deleted because it is linked to an auction or other records."
            });
        }
    }
}
