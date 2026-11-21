
namespace VehicleAuction.Api.Models;

public class Vehicle
{
    public int VehicleId { get; set; }

    public int ConsignorId { get; set; }

    public int YardLocationId { get; set; }

    public string? RegistrationNumber { get; set; }

    public string ChassisNumber { get; set; } = string.Empty;

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int ManufactureYear { get; set; }

    public string? Colour { get; set; }

    public int? MileageKm { get; set; }

    public string? FuelType { get; set; }

    public string? Transmission { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }
}
