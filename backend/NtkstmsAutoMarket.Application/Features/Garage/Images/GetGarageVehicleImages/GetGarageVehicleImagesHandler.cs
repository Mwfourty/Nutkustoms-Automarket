using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Images.GetGarageVehicleImages;

public class GetGarageVehicleImagesHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetGarageVehicleImagesHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetGarageVehicleImageResponse>> Handle(
        GetGarageVehicleImagesQuery query,
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

        return await _context.GarageVehicleImages
            .AsNoTracking()
            .Where(x =>
                x.GarageVehicleId == query.GarageVehicleId)
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.CreatedAt)
            .Select(x => new GetGarageVehicleImageResponse
            {
                Id = x.Id,
                Url = x.Url,
                DisplayOrder = x.DisplayOrder,
                IsPrimary = x.IsPrimary,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
