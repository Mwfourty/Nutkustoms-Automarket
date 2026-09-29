using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicle;

public class UpdateGarageVehicleHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateGarageVehicleHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateGarageVehicleResult> Handle(
        UpdateGarageVehicleCommand command,
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
                "You can only edit your own garage vehicles.");
        }

        vehicle.UpdateDetails(
            command.Make,
            command.Model,
            command.Year,
            command.Mileage,
            command.EngineDetails,
            command.Transmission,
            command.Kilowatts,
            command.Drivetrain,
            command.FuelType,
            command.BodyType,
            command.Color,
            command.Vin);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateGarageVehicleResult(
            vehicle.Id,
            vehicle.Make,
            vehicle.Model,
            vehicle.Year,
            vehicle.Mileage,
            vehicle.EngineDetails,
            vehicle.Transmission,
            vehicle.Kilowatts,
            vehicle.Drivetrain,
            vehicle.FuelType,
            vehicle.BodyType,
            vehicle.Color,
            vehicle.Vin,
            vehicle.IsPublic,
            vehicle.UpdatedAt);
    }
}
