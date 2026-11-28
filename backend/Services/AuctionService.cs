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
        public async Task<int> CreateAuctionAsync(DTOs.CreateAuctionRequest request, int adminUserId)
    {
        var title = request.Title?.Trim() ?? string.Empty;
        if (title.Length == 0)
            throw new ArgumentException("Title is required.");
        if (title.Length > 150)
            throw new ArgumentException("Title must be at most 150 characters.");

        if (request.StartsAt < DateTime.Now)
            throw new ArgumentException("StartsAt cannot be in the past.");

        if (request.EndsAt <= request.StartsAt)
            throw new ArgumentException("EndsAt must be later than StartsAt.");

        return await _repository.CreateAsync(
            title, request.Description,
            request.StartsAt, request.EndsAt, adminUserId);
    }
        public async Task PublishAuctionAsync(int id, int adminUserId)
    {
        await _repository.PublishAsync(id, adminUserId);
    }
    public async Task CancelAuctionAsync(int id, int adminUserId)
    {
        await _repository.CancelAsync(id, adminUserId);
    }
   public Task<AuctionReport?> GetReportAsync(int id) => _repository.GetReportAsync(id);
    
}