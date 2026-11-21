
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

    // GET: api/vehicles
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _repository.GetAllAsync();
        return Ok(vehicles);
    }

    // GET: api/vehicles/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await _repository.GetByIdAsync(id);

        if (vehicle == null)
            return NotFound(new
            {
                message = "Vehicle not found."
            });

        return Ok(vehicle);
    }

    // POST: api/vehicles
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] VehicleRequestDto request
    )
    {
        try
        {
            var vehicleId = await _repository.CreateAsync(request);

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

    // PUT: api/vehicles/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] VehicleRequestDto request
    )
    {
        try
        {
            var vehicle = await _repository.GetByIdAsync(id);

            if (vehicle == null)
                return NotFound(new
                {
                    message = "Vehicle not found."
                });

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

    // DELETE: api/vehicles/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _repository.DeleteAsync(id);

            if (!deleted)
                return NotFound(new
                {
                    message = "Vehicle not found."
                });

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
