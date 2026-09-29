using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.CreateListing;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.UpdateListing;

public class UpdateListingHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateListingHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateListingResult> Handle(
        UpdateListingCommand command,
        CancellationToken cancellationToken = default)
    {
        var listing = await _context.Listings
            .FirstOrDefaultAsync(
                x => x.Id == command.ListingId,
                cancellationToken);

        if (listing is null)
            throw new KeyNotFoundException(
                "Listing does not exist.");

        if (listing.SellerId != _currentUser.UserId)
        {
            throw new ForbiddenException(
                "You do not have permission to modify this listing.");
        }

        listing.UpdateDetails(
            command.Title,
            command.Description,
            command.Price,
            command.Condition,
            command.Location
        );

        if (listing.Type == ListingType.Vehicle)
        {
            if (command.Vehicle is null)
                throw new KeyNotFoundException(
                    "Vehicle details are required for vehicle listings.");

            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(
                    x => x.ListingId == listing.Id,
                    cancellationToken);

            if (vehicle is null)
                throw new KeyNotFoundException(
                    "Vehicle details do not exist for this listing.");

            vehicle.UpdateDetails(
                command.Vehicle.Make,
                command.Vehicle.Model,
                command.Vehicle.Year,
                command.Vehicle.Engine,
                command.Vehicle.Transmission,
                command.Vehicle.Kilowatts,
                command.Vehicle.Drivetrain,
                command.Vehicle.FuelType,
                command.Vehicle.BodyType,
                command.Vehicle.Colour
            );

            vehicle.UpdateMileage(command.Vehicle.Mileage);
        }

        if (listing.Type == ListingType.Part)
        {
            if (command.Part is null)
                throw new InvalidOperationException(
                    "Part details are required for part listings.");

            var part = await _context.Parts
                .FirstOrDefaultAsync(
                    x => x.ListingId == listing.Id,
                    cancellationToken);

            if (part is null)
                throw new InvalidOperationException(
                    "Part details do not exist for this listing.");

            part.UpdateDetails(
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
        }

        if (listing.Type == ListingType.Engine)
        {
            if (command.Engine is null)
                throw new InvalidOperationException(
                    "Engine details are required for engine listings.");

            var engine = await _context.Engines
                .FirstOrDefaultAsync(
                    x => x.ListingId == listing.Id,
                    cancellationToken);

            if (engine is null)
                throw new InvalidOperationException(
                    "Engine details do not exist for this listing.");

            engine.UpdateDetails(
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
        }

        if (listing.Type == ListingType.Wheel)
        {
            if (command.Wheel is null)
                throw new InvalidOperationException(
                    "Wheel details are required for wheel listings.");

            var wheel = await _context.Wheels
                .FirstOrDefaultAsync(
                    x => x.ListingId == listing.Id,
                    cancellationToken);

            if (wheel is null)
                throw new InvalidOperationException(
                    "Wheel details do not exist for this listing.");

            wheel.UpdateDetails(
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
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateListingResult(listing.Id);
    }
}