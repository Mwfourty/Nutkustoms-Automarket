using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.DeleteServiceRecord;

public class DeleteServiceRecordHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteServiceRecordHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        DeleteServiceRecordCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var serviceRecord = await _context.GarageServiceRecords
            .FirstOrDefaultAsync(
                x => x.Id == command.ServiceRecordId &&
                     x.GarageVehicleId == command.GarageVehicleId,
                cancellationToken);

        if (serviceRecord is null)
        {
            throw new KeyNotFoundException(
                "Service record does not exist.");
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
                "You can only delete service records from your own vehicles.");
        }

        _context.GarageServiceRecords.Remove(serviceRecord);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}
