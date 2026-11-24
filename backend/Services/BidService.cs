
using VehicleAuction.Api.DTOs;
using VehicleAuction.Api.Repositories;
using System.Collections.Generic;

namespace VehicleAuction.Api.Services;

public class BidService
{
    private readonly BidRepository _repository;

    public BidService(BidRepository repository)
    {
        _repository = repository;
    }

    public Task<decimal?> GetHighestBidAsync(int lotId)
    {
        if (lotId <= 0)
            throw new ArgumentException("Invalid lot ID.");

        return _repository.GetHighestBidAsync(lotId);
    }
    public Task<List<BidResponse>> GetBidHistoryAsync(int lotId)
    {
        if (lotId <= 0)
            throw new ArgumentException("Invalid lot ID.");

        return _repository.GetBidHistoryAsync(lotId);
    }

    public Task<BidResponse> PlaceBidAsync(
        int lotId,
        int bidderId,
        PlaceBidRequest request)
    {
        if (lotId <= 0)
            throw new ArgumentException("Invalid lot ID.");

        if (bidderId <= 0)
            throw new ArgumentException("Invalid bidder ID.");

        if (request.Amount <= 0)
            throw new ArgumentException("Bid amount must be greater than zero.");

        if (request.RequestId == Guid.Empty)
            throw new ArgumentException("A valid request ID is required.");

        return _repository.PlaceBidAsync(
            lotId,
            bidderId,
            request.Amount,
            request.RequestId);
    }
}
