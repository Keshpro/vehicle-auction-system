namespace VehicleAuction.Api.Models;

public class AuctionLot
{
    public int LotId { get; set; }
    public int LotNumber { get; set; }
    public int VehicleId { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int ManufactureYear { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal MinimumIncrement { get; set; }
    public DateTime BiddingStartsAt { get; set; }
    public DateTime BiddingEndsAt { get; set; }
    public string Status { get; set; } = string.Empty;
}