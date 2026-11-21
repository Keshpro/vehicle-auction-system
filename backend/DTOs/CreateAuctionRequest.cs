using System.ComponentModel.DataAnnotations;

namespace VehicleAuction.Api.DTOs;

public class CreateAuctionRequest
{
    [Required, StringLength(150, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime StartsAt { get; set; }

    [Required]
    public DateTime EndsAt { get; set; }
}