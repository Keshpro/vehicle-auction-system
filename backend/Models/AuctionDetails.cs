namespace VehicleAuction.Api.Models;

public class AuctionDetails
{
    public Auction Auction { get; set; } = new();
    public List<AuctionLot> Lots { get; set; } = new();
}