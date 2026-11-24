
namespace VehicleAuction.Api.DTOs;

public class BidResponse
{
    public int BidId { get; set; }

    public int LotId { get; set; }

    public int BidderId { get; set; }

    public string? BidderName { get; set; }

    public decimal Amount { get; set; }

    public DateTime PlacedAt { get; set; }
}
