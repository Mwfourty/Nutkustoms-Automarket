using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;

public class SellGarageVehicleHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SellGarageVehicleHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<SellGarageVehicleResult> Handle(
        SellGarageVehicleCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var garageVehicle = await _context.GarageVehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == command.GarageVehicleId,
                cancellationToken);

        if (garageVehicle is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        if (garageVehicle.OwnerId != currentUserId)
        {
            throw new ForbiddenException(
                "You can only sell vehicles from your own garage.");
        }

        var existingListing = await _context.Listings
            .AsNoTracking()
            .AnyAsync(
                x =>
                    x.SourceGarageVehicleId == command.GarageVehicleId &&
                    (
                        x.Status == ListingStatus.Draft ||
                        x.Status == ListingStatus.Active ||
                        x.Status == ListingStatus.Reserved
                    ),
                cancellationToken);

        if (existingListing)
        {
            throw new InvalidOperationException(
                "This garage vehicle already has an open marketplace listing.");
        }

        if (garageVehicle.Drivetrain is null)
        {
            throw new InvalidOperationException(
                "Add a drivetrain before listing this vehicle for sale.");
        }

        if (garageVehicle.FuelType is null)
        {
            throw new InvalidOperationException(
                "Add a fuel type before listing this vehicle for sale.");
        }

        if (garageVehicle.BodyType is null)
        {
            throw new InvalidOperationException(
                "Add a body type before listing this vehicle for sale.");
        }

        if (string.IsNullOrWhiteSpace(garageVehicle.EngineDetails))
        {
            throw new InvalidOperationException(
                "Add engine details before listing this vehicle for sale.");
        }

        if (string.IsNullOrWhiteSpace(garageVehicle.Transmission))
        {
            throw new InvalidOperationException(
                "Add transmission details before listing this vehicle for sale.");
        }

        if (string.IsNullOrWhiteSpace(garageVehicle.Color))
        {
            throw new InvalidOperationException(
                "Add a vehicle colour before listing this vehicle for sale.");
        }

        var listing = new Listing(
            currentUserId,
            command.Title,
            command.Description,
            command.Price,
            ListingType.Vehicle,
            command.Condition,
            command.Location);

        listing.SetSourceGarageVehicle(
            garageVehicle.Id);

        var vehicle = new Vehicle(
            listing.Id,
            garageVehicle.Make,
            garageVehicle.Model,
            garageVehicle.Year,
            garageVehicle.Mileage,
            garageVehicle.EngineDetails,
            garageVehicle.Transmission,
            garageVehicle.Kilowatts,
            garageVehicle.Drivetrain.Value,
            garageVehicle.FuelType.Value,
            garageVehicle.BodyType.Value,
            garageVehicle.Color,
            garageVehicle.Vin);

        _context.Listings.Add(listing);
        _context.Vehicles.Add(vehicle);

        var garageImages = await _context.GarageVehicleImages
            .AsNoTracking()
            .Where(x =>
                x.GarageVehicleId == command.GarageVehicleId)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync(cancellationToken);

        foreach (var garageImage in garageImages)
        {
            var listingImage = new ListingImage(
                listing.Id,
                garageImage.Url,
                garageImage.DisplayOrder,
                garageImage.IsPrimary);

            _context.ListingImages.Add(listingImage);
        }

        await _context.SaveChangesAsync(
            cancellationToken);

        return new SellGarageVehicleResult(
            listing.Id,
            vehicle.Id,
            garageVehicle.Id,
            listing.Status,
            garageImages.Count);
    }
}
