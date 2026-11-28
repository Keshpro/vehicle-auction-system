namespace VehicleAuction.Api.Models;

public class AuctionReport
{
    public int AuctionId { get; set; }
    public int TotalLots { get; set; }
    public int Scheduled { get; set; }
    public int OpenLots { get; set; }
    public int Closed { get; set; }
    public int Withdrawn { get; set; }
    public decimal TotalStartingPrice { get; set; }
}