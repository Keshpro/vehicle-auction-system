
using System.ComponentModel.DataAnnotations;

namespace VehicleAuction.Api.DTOs;

public class PlaceBidRequest
{
    [Required]
    [Range(typeof(decimal), "0.01", "9999999999.99",
        ErrorMessage = "Bid amount must be greater than zero.")]
    public decimal Amount { get; set; }

    [Required]
    public Guid RequestId { get; set; }
}
