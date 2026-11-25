using System.Data;
using MySqlConnector;
using VehicleAuction.Api.DTOs;

namespace VehicleAuction.Api.Repositories;

internal sealed class Member02ReportingRepository(string connectionString)
{
    public async Task<Member02ReportResponse> ReadReportAsync(
        Member02ReportQuery query, DateOnly from, DateOnly to, int? actorUserId,
        CancellationToken cancellationToken)
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var transaction = actorUserId.HasValue
            ? await connection.BeginTransactionAsync(cancellationToken)
            : null;

        await using var command = new MySqlCommand(
            "CALL sp_member02_auction_report(@from, @to, @minBids, @search)", connection, transaction);
        AddDates(command, from, to);
        command.Parameters.AddWithValue("@minBids", query.MinBids);
        command.Parameters.AddWithValue("@search", query.Search);

        var items = new List<Member02AuctionReportRow>(query.PageSize);
        long auctionCount = 0;
        long lotCount = 0;
        long soldLotCount = 0;
        long bidCount = 0;
        decimal salesTotal = 0;
        var offset = query.Offset;

        await using (var reader = await command.ExecuteReaderAsync(cancellationToken))
        {
            while (await reader.ReadAsync(cancellationToken))
            {
                if (auctionCount >= offset && items.Count < query.PageSize)
                {
                    items.Add(new Member02AuctionReportRow(
                        reader.GetInt32("auction_id"), reader.GetString("title"),
                        reader.GetDateTime("starts_at"), reader.GetString("status"),
                        reader.GetInt64("lot_count"), reader.GetInt64("sold_lot_count"),
                        reader.GetInt64("bid_count"), NullableDecimal(reader, "average_bids_per_lot"),
                        reader.GetDecimal("sales_total"), NullableDecimal(reader, "average_bid"),
                        NullableDecimal(reader, "minimum_bid"), NullableDecimal(reader, "maximum_bid"),
                        NullableDecimal(reader, "sale_rate_pct")));
                }

                auctionCount++;
                lotCount += reader.GetInt64("lot_count");
                soldLotCount += reader.GetInt64("sold_lot_count");
                bidCount += reader.GetInt64("bid_count");
                salesTotal += reader.GetDecimal("sales_total");
            }
        }

        if (actorUserId is int actorId && transaction is not null)
        {
            const string auditSql = """
                INSERT INTO audit_logs (actor_user_id, action, entity_type, details)
                VALUES (@actor, 'GENERATE_AUCTION_REPORT', 'report', @details)
                """;
            await using var audit = new MySqlCommand(auditSql, connection, transaction);
            audit.Parameters.AddWithValue("@actor", actorId);
            audit.Parameters.AddWithValue("@details", FormattableString.Invariant(
                $"Auction report {from:yyyy-MM-dd} to {to:yyyy-MM-dd} (exclusive); matching auctions: {auctionCount}"));
            await audit.ExecuteNonQueryAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }

        return new Member02ReportResponse(from, to,
            new Member02ReportSummary(auctionCount, lotCount, soldLotCount, bidCount, salesTotal),
            items, query.Page, query.PageSize, auctionCount > offset + items.Count);
    }

    public async Task<Member02AuditResponse> ReadAuditLogsAsync(
        Member02AuditQuery query, CancellationToken cancellationToken)
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var transaction = await connection.BeginTransactionAsync(
            IsolationLevel.RepeatableRead, cancellationToken);
        await using var command = new MySqlCommand(
            "CALL sp_member02_audit_logs(@from, @to, @action, @entityType, @search, @size, @offset)",
            connection, transaction);
        AddDates(command, query.From, query.To);
        command.Parameters.AddWithValue("@action", query.Action);
        command.Parameters.AddWithValue("@entityType", query.EntityType);
        command.Parameters.AddWithValue("@search", query.Search);
        var sizeParameter = command.Parameters.AddWithValue("@size", query.PageSize);
        var offsetParameter = command.Parameters.AddWithValue("@offset", query.Offset);
        var items = new List<Member02AuditRow>(query.PageSize);

        await using (var reader = await command.ExecuteReaderAsync(cancellationToken))
        {
            while (await reader.ReadAsync(cancellationToken))
            {
                items.Add(new Member02AuditRow(
                    reader.GetInt32("audit_log_id"), NullableInt32(reader, "actor_user_id"),
                    reader.IsDBNull(reader.GetOrdinal("actor_name")) ? null : reader.GetString("actor_name"),
                    reader.GetString("action"), reader.GetString("entity_type"),
                    NullableInt32(reader, "entity_id"), reader.GetDateTime("created_at")));
            }
        }

        bool hasMore = false;
        if (items.Count == query.PageSize)
        {
            sizeParameter.Value = 1;
            offsetParameter.Value = query.Offset + items.Count;
            await using var next = await command.ExecuteReaderAsync(cancellationToken);
            hasMore = await next.ReadAsync(cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
        return new Member02AuditResponse(items, query.Page, query.PageSize, hasMore);
    }

    private static void AddDates(MySqlCommand command, DateOnly? from, DateOnly? to)
    {
        command.Parameters.Add("@from", MySqlDbType.DateTime).Value =
            (object?)from?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
        command.Parameters.Add("@to", MySqlDbType.DateTime).Value =
            (object?)to?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
    }

    private static decimal? NullableDecimal(MySqlDataReader reader, string name) =>
        reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetDecimal(name);

    private static int? NullableInt32(MySqlDataReader reader, string name) =>
        reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetInt32(name);
}
