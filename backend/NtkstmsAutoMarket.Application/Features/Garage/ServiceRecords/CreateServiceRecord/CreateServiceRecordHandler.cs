using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.CreateServiceRecord;

public class CreateServiceRecordHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateServiceRecordHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateServiceRecordResult> Handle(
        CreateServiceRecordCommand command,
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
                "You can only add service records to your own vehicles.");
        }

        var serviceRecord = new GarageServiceRecord(
            command.GarageVehicleId,
            command.Title,
            command.Description,
            command.ServiceDate,
            command.Mileage,
            command.ServiceProvider,
            command.Cost);

        _context.GarageServiceRecords.Add(serviceRecord);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new CreateServiceRecordResult(
            serviceRecord.Id,
            serviceRecord.GarageVehicleId,
            serviceRecord.Title,
            serviceRecord.Description,
            serviceRecord.ServiceDate,
            serviceRecord.Mileage,
            serviceRecord.ServiceProvider,
            serviceRecord.Cost,
            serviceRecord.CreatedAt);
    }
}
