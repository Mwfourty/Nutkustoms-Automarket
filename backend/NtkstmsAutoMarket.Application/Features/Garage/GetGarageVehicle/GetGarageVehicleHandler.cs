using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetGarageVehicle;

public class GetGarageVehicleHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetGarageVehicleHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetGarageVehicleResponse> Handle(
        GetGarageVehicleQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserIdOrNull;

        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .Where(x =>
                x.Id == query.VehicleId &&
                (
                    x.IsPublic ||
                    (
                        currentUserId.HasValue &&
                        x.OwnerId == currentUserId.Value
                    )
                ))
            .Select(x => new GetGarageVehicleResponse
            {
                Id = x.Id,
                OwnerId = x.OwnerId,
                Make = x.Make,
                Model = x.Model,
                Year = x.Year,
                Mileage = x.Mileage,
                EngineDetails = x.EngineDetails,
                Transmission = x.Transmission,
                Kilowatts = x.Kilowatts,
                Drivetrain = x.Drivetrain,
                FuelType = x.FuelType,
                BodyType = x.BodyType,
                Color = x.Color,
                Vin =
                    currentUserId.HasValue &&
                    x.OwnerId == currentUserId.Value
                        ? x.Vin
                        : null,
                IsPublic = x.IsPublic,

                MarketplaceListingId =
                    currentUserId.HasValue &&
                    x.OwnerId == currentUserId.Value
                        ? _context.Listings
                            .Where(listing =>
                                listing.SourceGarageVehicleId == x.Id &&
                                (
                                    listing.Status == ListingStatus.Draft ||
                                    listing.Status == ListingStatus.Active ||
                                    listing.Status == ListingStatus.Reserved
                                ))
                            .OrderByDescending(listing => listing.CreatedAt)
                            .Select(listing => (Guid?)listing.Id)
                            .FirstOrDefault()
                        : _context.Listings
                            .Where(listing =>
                                listing.SourceGarageVehicleId == x.Id &&
                                listing.Status == ListingStatus.Active)
                            .Select(listing => (Guid?)listing.Id)
                            .FirstOrDefault(),

                MarketplaceListingStatus =
                    currentUserId.HasValue &&
                    x.OwnerId == currentUserId.Value
                        ? _context.Listings
                            .Where(listing =>
                                listing.SourceGarageVehicleId == x.Id &&
                                (
                                    listing.Status == ListingStatus.Draft ||
                                    listing.Status == ListingStatus.Active ||
                                    listing.Status == ListingStatus.Reserved
                                ))
                            .OrderByDescending(listing => listing.CreatedAt)
                            .Select(listing => (ListingStatus?)listing.Status)
                            .FirstOrDefault()
                        : _context.Listings
                            .Where(listing =>
                                listing.SourceGarageVehicleId == x.Id &&
                                listing.Status == ListingStatus.Active)
                            .Select(listing => (ListingStatus?)listing.Status)
                            .FirstOrDefault(),

                HasOpenListing =
                    currentUserId.HasValue &&
                    x.OwnerId == currentUserId.Value
                        ? _context.Listings.Any(listing =>
                            listing.SourceGarageVehicleId == x.Id &&
                            (
                                listing.Status == ListingStatus.Draft ||
                                listing.Status == ListingStatus.Active ||
                                listing.Status == ListingStatus.Reserved
                            ))
                        : _context.Listings.Any(listing =>
                            listing.SourceGarageVehicleId == x.Id &&
                            listing.Status == ListingStatus.Active),

                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (vehicle is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        return vehicle;
    }
}
