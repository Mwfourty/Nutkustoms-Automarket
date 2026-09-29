using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.GetModifications;

public class GetModificationsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetModificationsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetModificationResponse>> Handle(
        GetModificationsQuery query,
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

        return await _context.GarageModifications
            .AsNoTracking()
            .Where(x =>
                x.GarageVehicleId == query.GarageVehicleId)
            .OrderBy(x => x.Category)
            .ThenByDescending(x => x.InstalledDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new GetModificationResponse
            {
                Id = x.Id,
                GarageVehicleId = x.GarageVehicleId,
                Name = x.Name,
                Category = x.Category,
                Brand = x.Brand,
                Description = x.Description,
                InstalledDate = x.InstalledDate,
                Cost = isOwner
                    ? x.Cost
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
