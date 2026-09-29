using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicleVisibility;

public class UpdateGarageVehicleVisibilityHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateGarageVehicleVisibilityHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateGarageVehicleVisibilityResult> Handle(
        UpdateGarageVehicleVisibilityCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var vehicle = await _context.GarageVehicles
            .FirstOrDefaultAsync(
                x => x.Id == command.GarageVehicleId,
                cancellationToken);

        if (vehicle is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        if (vehicle.OwnerId != currentUserId)
        {
            throw new ForbiddenException(
                "You can only change visibility for your own vehicles.");
        }

        if (command.IsPublic)
        {
            vehicle.MakePublic();
        }
        else
        {
            vehicle.MakePrivate();
        }

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateGarageVehicleVisibilityResult(
            vehicle.Id,
            vehicle.IsPublic,
            vehicle.UpdatedAt);
    }
}
