using System.ComponentModel.DataAnnotations;

namespace VehicleAuction.Api.DTOs;

public class Member02PageQuery
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 25;

    [StringLength(150)]
    public string? Search { get; set; }

    public DateOnly? From { get; set; }
    public DateOnly? To { get; set; }

    internal long Offset => ((long)Page - 1) * PageSize;
}

public sealed class Member02ReportQuery : Member02PageQuery
{
    [Range(0, int.MaxValue)]
    public int MinBids { get; set; }
}

public sealed class Member02AuditQuery : Member02PageQuery
{
    [StringLength(100)]
    public string? Action { get; set; }

    [StringLength(50)]
    public string? EntityType { get; set; }
}

public sealed record Member02AuctionReportRow(
    int AuctionId, string Title, DateTime StartsAt, string Status,
    long LotCount, long SoldLotCount, long BidCount, decimal? AverageBidsPerLot,
    decimal SalesTotal, decimal? AverageBid, decimal? MinimumBid,
    decimal? MaximumBid, decimal? SaleRatePct);

public sealed record Member02ReportSummary(
    long AuctionCount, long LotCount, long SoldLotCount, long BidCount,
    decimal SalesTotal);

public sealed record Member02ReportResponse(
    DateOnly From, DateOnly To, Member02ReportSummary Summary,
    IReadOnlyList<Member02AuctionReportRow> Items, int Page, int PageSize, bool HasMore);

public sealed record Member02AuditRow(
    int AuditLogId, int? ActorUserId, string? ActorName, string Action,
    string EntityType, int? EntityId, DateTime CreatedAt);

public sealed record Member02AuditResponse(
    IReadOnlyList<Member02AuditRow> Items, int Page, int PageSize, bool HasMore);
