
using System.ComponentModel.DataAnnotations;

namespace VehicleAuction.Api.DTOs;

public class VehicleRequestDto
{
    [Required]
    public int ConsignorId { get; set; }

    [Required]
    public int YardLocationId { get; set; }

    [MaxLength(30)]
    public string? RegistrationNumber { get; set; }

    [Required]
    [MaxLength(50)]
    public string ChassisNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Make { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Model { get; set; } = string.Empty;

    [Range(1886, 2100)]
    public int ManufactureYear { get; set; }

    [MaxLength(30)]
    public string? Colour { get; set; }

    [Range(0, int.MaxValue)]
    public int? MileageKm { get; set; }

    [MaxLength(30)]
    public string? FuelType { get; set; }

    [MaxLength(30)]
    public string? Transmission { get; set; }

    public string? Description { get; set; }
}
