using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.CreateModification;

public class CreateModificationHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateModificationHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateModificationResult> Handle(
        CreateModificationCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
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
                "You can only add modifications to your own vehicles.");
        }

        var modification = new GarageModification(
            command.GarageVehicleId,
            command.Name,
            command.Category,
            command.Brand,
            command.Description,
            command.InstalledDate,
            command.Cost);

        _context.GarageModifications.Add(modification);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new CreateModificationResult(
            modification.Id,
            modification.GarageVehicleId,
            modification.Name,
            modification.Category,
            modification.Brand,
            modification.Description,
            modification.InstalledDate,
            modification.Cost,
            modification.CreatedAt);
    }
}
