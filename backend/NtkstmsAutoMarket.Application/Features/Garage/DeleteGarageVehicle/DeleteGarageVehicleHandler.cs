using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.DeleteGarageVehicle;

public class DeleteGarageVehicleHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteGarageVehicleHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        DeleteGarageVehicleCommand command,
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
                "You can only delete your own garage vehicles.");
        }

        _context.GarageVehicles.Remove(vehicle);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}
