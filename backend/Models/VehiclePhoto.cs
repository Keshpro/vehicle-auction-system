
namespace VehicleAuction.Api.Models;

public class VehiclePhoto
{
    public int PhotoId { get; set; }

    public int VehicleId { get; set; }

    public string PhotoUrl { get; set; } = string.Empty;

    public bool IsCover { get; set; }

    public int DisplayOrder { get; set; }
}
