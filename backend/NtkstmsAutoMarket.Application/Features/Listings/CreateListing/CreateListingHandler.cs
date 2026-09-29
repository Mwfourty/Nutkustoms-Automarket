using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public class CreateListingHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateListingHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateListingResult> Handle(
        CreateListingCommand command,
        CancellationToken cancellationToken = default)
    {
        var sellerId = _currentUser.UserId;

        var sellerExists = await _context.Users
            .AnyAsync(
                x => x.Id == sellerId,
                cancellationToken);

        if (!sellerExists)
            throw new InvalidOperationException(
                "Seller does not exist.");

        var listing = new Listing(
            sellerId,
            command.Title,
            command.Description,
            command.Price,
            command.Type,
            command.Condition,
            command.Location
        );

        _context.Listings.Add(listing);

        if (command.Type == ListingType.Vehicle)
        {
            if (command.Vehicle is null)
                throw new InvalidOperationException(
                    "Vehicle details are required for vehicle listings.");

            var vehicle = new Vehicle(
                listing.Id,
                command.Vehicle.Make,
                command.Vehicle.Model,
                command.Vehicle.Year,
                command.Vehicle.Mileage,
                command.Vehicle.Engine,
                command.Vehicle.Transmission,
                command.Vehicle.Kilowatts,
                command.Vehicle.Drivetrain,
                command.Vehicle.FuelType,
                command.Vehicle.BodyType,
                command.Vehicle.Colour,
                command.Vehicle.VIN
            );

            _context.Vehicles.Add(vehicle);
        }

        if (command.Type == ListingType.Part)
        {
            if (command.Part is null)
                throw new InvalidOperationException(
                    "Part details are required for part listings.");

            var part = new Part(
                listing.Id,
                command.Part.Name,
                command.Part.PartNumber,
                command.Part.Description,
                command.Part.Manufacturer,
                command.Part.CompatibleMake,
                command.Part.CompatibleModel,
                command.Part.CompatibleYearFrom,
                command.Part.CompatibleYearTo,
                command.Part.Condition
            );

            _context.Parts.Add(part);
        }

        if (command.Type == ListingType.Engine)
        {
            if (command.Engine is null)
                throw new InvalidOperationException(
                    "Engine details are required for engine listings.");

            var engine = new Engine(
                listing.Id,
                command.Engine.Manufacturer,
                command.Engine.Model,
                command.Engine.EngineCode,
                command.Engine.Displacement,
                command.Engine.Kilowatts,
                command.Engine.FuelType,
                command.Engine.Mileage,
                command.Engine.CompatibleMake,
                command.Engine.CompatibleModel,
                command.Engine.CompatibleYearFrom,
                command.Engine.CompatibleYearTo
            );

            _context.Engines.Add(engine);
        }

        if (command.Type == ListingType.Wheel)
        {
            if (command.Wheel is null)
                throw new InvalidOperationException(
                    "Wheel details are required for wheel listings.");

            var wheel = new Wheel(
                listing.Id,
                command.Wheel.Brand,
                command.Wheel.Model,
                command.Wheel.Diameter,
                command.Wheel.Width,
                command.Wheel.Offset,
                command.Wheel.BoltPattern,
                command.Wheel.Material,
                command.Wheel.Colour,
                command.Wheel.CompatibleMake,
                command.Wheel.CompatibleModel,
                command.Wheel.CompatibleYearFrom,
                command.Wheel.CompatibleYearTo,
                command.Wheel.Quantity
            );

            _context.Wheels.Add(wheel);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new CreateListingResult(listing.Id);
    }
}