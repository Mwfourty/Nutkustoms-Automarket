using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.GetServiceRecords;

public class GetServiceRecordsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetServiceRecordsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetServiceRecordResponse>> Handle(
        GetServiceRecordsQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserIdOrNull;

        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == query.GarageVehicleId,
                cancellationToken);

        if (vehicle is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        var isOwner =
            currentUserId.HasValue &&
            vehicle.OwnerId == currentUserId.Value;

        if (!vehicle.IsPublic && !isOwner)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        return await _context.GarageServiceRecords
            .AsNoTracking()
            .Where(x =>
                x.GarageVehicleId == query.GarageVehicleId)
            .OrderByDescending(x => x.ServiceDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new GetServiceRecordResponse
            {
                Id = x.Id,
                GarageVehicleId = x.GarageVehicleId,
                Title = x.Title,
                Description = x.Description,
                ServiceDate = x.ServiceDate,
                Mileage = x.Mileage,
                ServiceProvider = x.ServiceProvider,
                Cost = isOwner
                    ? x.Cost
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
