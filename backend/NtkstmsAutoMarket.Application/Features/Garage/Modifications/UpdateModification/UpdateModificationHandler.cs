using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.UpdateModification;

public class UpdateModificationHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateModificationHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateModificationResult> Handle(
        UpdateModificationCommand command,
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
                "You can only edit modifications on your own vehicles.");
        }

        modification.Update(
            command.Name,
            command.Category,
            command.Brand,
            command.Description,
            command.InstalledDate,
            command.Cost);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateModificationResult(
            modification.Id,
            modification.GarageVehicleId,
            modification.Name,
            modification.Category,
            modification.Brand,
            modification.Description,
            modification.InstalledDate,
            modification.Cost,
            modification.CreatedAt,
            modification.UpdatedAt);
    }
}
