using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetPublicGarage;

public class GetPublicGarageHandler
{
    private readonly IApplicationDbContext _context;

    public GetPublicGarageHandler(
        IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetPublicGarageResult> Handle(
        GetPublicGarageQuery query,
        CancellationToken cancellationToken = default)
    {
        var owner = await _context.Users
            .AsNoTracking()
            .Where(x =>
                x.Id == query.UserId &&
                x.IsActive)
            .Select(x => new GetPublicProfileResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Username = x.Username,
                ProfileImageUrl = x.ProfileImageUrl,
                IsVerified = x.IsVerified,
                MemberSince = x.CreatedAt,

                AverageRating = _context.SellerReviews
                    .Where(review =>
                        review.SellerId == x.Id)
                    .Select(review =>
                        (double?)review.Rating)
                    .Average() ?? 0,

                ReviewCount = _context.SellerReviews
                    .Count(review =>
                        review.SellerId == x.Id)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (owner is null)
        {
            throw new KeyNotFoundException(
                "Garage owner does not exist.");
        }

        var vehicles = await _context.GarageVehicles
            .AsNoTracking()
            .Where(x =>
                x.OwnerId == query.UserId &&
                x.IsPublic)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new GetPublicGarageVehicleResponse
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

                PrimaryImageUrl = _context.GarageVehicleImages
                    .Where(image =>
                        image.GarageVehicleId == x.Id &&
                        image.IsPrimary)
                    .Select(image => image.Url)
                    .FirstOrDefault(),

                IsForSale = _context.Listings.Any(listing =>
                    listing.SourceGarageVehicleId == x.Id &&
                    listing.Status == ListingStatus.Active),

                MarketplaceListingId = _context.Listings
                    .Where(listing =>
                        listing.SourceGarageVehicleId == x.Id &&
                        listing.Status == ListingStatus.Active)
                    .OrderByDescending(listing => listing.CreatedAt)
                    .Select(listing => (Guid?)listing.Id)
                    .FirstOrDefault(),

                MarketplacePrice = _context.Listings
                    .Where(listing =>
                        listing.SourceGarageVehicleId == x.Id &&
                        listing.Status == ListingStatus.Active)
                    .OrderByDescending(listing => listing.CreatedAt)
                    .Select(listing => (decimal?)listing.Price)
                    .FirstOrDefault(),

                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new GetPublicGarageResult
        {
            Owner = owner,
            Vehicles = vehicles
        };
    }
}
