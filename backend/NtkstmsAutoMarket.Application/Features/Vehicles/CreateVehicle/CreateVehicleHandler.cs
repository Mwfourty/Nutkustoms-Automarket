using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Vehicles.CreateVehicle;

public class CreateVehicleHandler
{
    private readonly IApplicationDbContext _context;

    public CreateVehicleHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(
        CreateVehicleCommand command,
        CancellationToken cancellationToken)
    {
        var listing = await _context.Listings
            .FindAsync(
                new object[] { command.ListingId },
                cancellationToken);

        if (listing == null)
        {
            throw new KeyNotFoundException(
                $"Listing with ID {command.ListingId} was not found.");
        }

        var vehicle = new Vehicle(
            command.ListingId,
            command.Make,
            command.Model,
            command.Year,
            command.Mileage,
            command.Engine,
            command.Transmission,
            command.Kilowatts,
            command.Drivetrain,
            command.FuelType,
            command.BodyType,
            command.Colour,
            command.VIN
        );

        _context.Vehicles.Add(vehicle);

        await _context.SaveChangesAsync(cancellationToken);

        return vehicle.Id;
    }
}