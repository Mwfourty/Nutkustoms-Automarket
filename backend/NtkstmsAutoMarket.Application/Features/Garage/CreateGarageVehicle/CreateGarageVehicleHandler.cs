using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.CreateGarageVehicle;

public class CreateGarageVehicleHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateGarageVehicleHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateGarageVehicleResult> Handle(
        CreateGarageVehicleCommand command,
        CancellationToken cancellationToken = default)
    {
        var ownerId = _currentUser.UserId;

        var ownerExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == ownerId &&
                     x.IsActive,
                cancellationToken);

        if (!ownerExists)
        {
            throw new KeyNotFoundException(
                "User does not exist.");
        }

        var vehicle = new GarageVehicle(
            ownerId,
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
            command.Vin,
            command.IsPublic);

        _context.GarageVehicles.Add(vehicle);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new CreateGarageVehicleResult(
            vehicle.Id,
            vehicle.OwnerId,
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
            vehicle.CreatedAt);
    }
}
