using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.DeleteModification;

public class DeleteModificationHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteModificationHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        DeleteModificationCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var modification = await _context.GarageModifications
            .FirstOrDefaultAsync(
                x => x.Id == command.ModificationId &&
                     x.GarageVehicleId == command.GarageVehicleId,
                cancellationToken);

        if (modification is null)
        {
            throw new KeyNotFoundException(
                "Modification does not exist.");
        }

        var isOwner = await _context.GarageVehicles
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == command.GarageVehicleId &&
                     x.OwnerId == currentUserId,
                cancellationToken);

        if (!isOwner)
        {
            throw new ForbiddenException(
                "You can only delete modifications from your own vehicles.");
        }

        _context.GarageModifications.Remove(modification);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}
