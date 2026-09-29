using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetMyGarage;

public class GetMyGarageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyGarageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetMyGarageVehicleResponse>> Handle(
        GetMyGarageQuery query,
        CancellationToken cancellationToken = default)
    {
        var ownerId = _currentUser.UserId;

        return await _context.GarageVehicles
            .AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new GetMyGarageVehicleResponse
            {
                Id = x.Id,
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
                Vin = x.Vin,
                IsPublic = x.IsPublic,

                PrimaryImageUrl = _context.GarageVehicleImages
                    .Where(image =>
                        image.GarageVehicleId == x.Id &&
                        image.IsPrimary)
                    .Select(image => image.Url)
                    .FirstOrDefault(),

                MarketplaceListingId = _context.Listings
                    .Where(listing =>
                        listing.SourceGarageVehicleId == x.Id &&
                        (
                            listing.Status == ListingStatus.Draft ||
                            listing.Status == ListingStatus.Active ||
                            listing.Status == ListingStatus.Reserved
                        ))
                    .OrderByDescending(listing => listing.CreatedAt)
                    .Select(listing => (Guid?)listing.Id)
                    .FirstOrDefault(),

                MarketplaceListingStatus = _context.Listings
                    .Where(listing =>
                        listing.SourceGarageVehicleId == x.Id &&
                        (
                            listing.Status == ListingStatus.Draft ||
                            listing.Status == ListingStatus.Active ||
                            listing.Status == ListingStatus.Reserved
                        ))
                    .OrderByDescending(listing => listing.CreatedAt)
                    .Select(listing => (ListingStatus?)listing.Status)
                    .FirstOrDefault(),

                HasOpenListing = _context.Listings
                    .Any(listing =>
                        listing.SourceGarageVehicleId == x.Id &&
                        (
                            listing.Status == ListingStatus.Draft ||
                            listing.Status == ListingStatus.Active ||
                            listing.Status == ListingStatus.Reserved
                        )),

                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
