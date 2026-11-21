using VehicleAuction.Api.Models;
using VehicleAuction.Api.Repositories;

namespace VehicleAuction.Api.Services;

public class AuctionService
{
    private readonly AuctionRepository _repository;

    public AuctionService(AuctionRepository repository)
    {
        _repository = repository;
    }

    public Task<List<Auction>> GetAuctionsAsync(string? status)
    {
        return _repository.GetAllAsync(status);
    }
        public Task<AuctionDetails?> GetAuctionAsync(int id)
    {
        return _repository.GetByIdAsync(id);
    }
}