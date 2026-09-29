using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.UpdateServiceRecord;

public class UpdateServiceRecordHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateServiceRecordHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateServiceRecordResult> Handle(
        UpdateServiceRecordCommand command,
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
                "You can only edit service records for your own vehicles.");
        }

        serviceRecord.Update(
            command.Title,
            command.Description,
            command.ServiceDate,
            command.Mileage,
            command.ServiceProvider,
            command.Cost);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateServiceRecordResult(
            serviceRecord.Id,
            serviceRecord.GarageVehicleId,
            serviceRecord.Title,
            serviceRecord.Description,
            serviceRecord.ServiceDate,
            serviceRecord.Mileage,
            serviceRecord.ServiceProvider,
            serviceRecord.Cost,
            serviceRecord.CreatedAt,
            serviceRecord.UpdatedAt);
    }
}
