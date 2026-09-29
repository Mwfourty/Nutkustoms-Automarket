using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Application.Features.Listings.GetListingImages;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.GetListingDocuments;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListingById;

public class GetListingByIdHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetListingByIdHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetListingByIdResponse?> Handle(
        GetListingByIdQuery query,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUser.UserIdOrNull;

        return await _context.Listings
            .AsNoTracking()
            .Where(listing => listing.Id == query.ListingId)
            .Where(listing =>
                (listing.Status == ListingStatus.Active &&
                 listing.Seller.IsActive) ||
                (currentUserId.HasValue &&
                 listing.SellerId == currentUserId.Value))
            .Select(listing => new GetListingByIdResponse
            {
                Id = listing.Id,
                SellerId = listing.SellerId,
                Seller = new GetPublicProfileResponse
                {
                    Id = listing.Seller.Id,
                    FirstName = listing.Seller.FirstName,
                    LastName = listing.Seller.LastName,
                    Username = listing.Seller.Username,
                    ProfileImageUrl = listing.Seller.ProfileImageUrl,
                    IsVerified = listing.Seller.IsVerified,
                    MemberSince = listing.Seller.CreatedAt,

                    AverageRating = _context.SellerReviews
                        .Where(review =>
                            review.SellerId == listing.SellerId)
                        .Select(review => (double?)review.Rating)
                        .Average() ?? 0,

                    ReviewCount = _context.SellerReviews
                        .Count(review =>
                            review.SellerId == listing.SellerId)
                },
                Title = listing.Title,
                Description = listing.Description,
                Price = listing.Price,
                Type = listing.Type,
                Condition = listing.Condition,
                Status = listing.Status,
                Location = listing.Location,
                CreatedAt = listing.CreatedAt,

                Vehicle = listing.Vehicle == null
                    ? null
                    : new VehicleResponse
                    {
                        Id = listing.Vehicle.Id,
                        Make = listing.Vehicle.Make,
                        Model = listing.Vehicle.Model,
                        Year = listing.Vehicle.Year,
                        Mileage = listing.Vehicle.Mileage,
                        Engine = listing.Vehicle.Engine,
                        Transmission = listing.Vehicle.Transmission,
                        Kilowatts = listing.Vehicle.Kilowatts,
                        Drivetrain = listing.Vehicle.Drivetrain,
                        FuelType = listing.Vehicle.FuelType,
                        BodyType = listing.Vehicle.BodyType,
                        Colour = listing.Vehicle.Colour,
                        VIN = listing.Vehicle.VIN
                    },

                Part = listing.Part == null
                    ? null
                    : new PartResponse
                    {
                        Id = listing.Part.Id,
                        Name = listing.Part.Name,
                        PartNumber = listing.Part.PartNumber,
                        Description = listing.Part.Description,
                        Manufacturer = listing.Part.Manufacturer,
                        CompatibleMake = listing.Part.CompatibleMake,
                        CompatibleModel = listing.Part.CompatibleModel,
                        CompatibleYearFrom = listing.Part.CompatibleYearFrom,
                        CompatibleYearTo = listing.Part.CompatibleYearTo,
                        Condition = listing.Part.Condition
                    },

                Engine = listing.Engine == null
                    ? null
                    : new EngineResponse
                    {
                        Id = listing.Engine.Id,
                        Manufacturer = listing.Engine.Manufacturer,
                        Model = listing.Engine.Model,
                        EngineCode = listing.Engine.EngineCode,
                        Displacement = listing.Engine.Displacement,
                        Kilowatts = listing.Engine.Kilowatts,
                        FuelType = listing.Engine.FuelType,
                        Mileage = listing.Engine.Mileage,
                        CompatibleMake = listing.Engine.CompatibleMake,
                        CompatibleModel = listing.Engine.CompatibleModel,
                        CompatibleYearFrom = listing.Engine.CompatibleYearFrom,
                        CompatibleYearTo = listing.Engine.CompatibleYearTo
                    },

                Wheel = listing.Wheel == null
                    ? null
                    : new WheelResponse
                    {
                        Id = listing.Wheel.Id,
                        Brand = listing.Wheel.Brand,
                        Model = listing.Wheel.Model,
                        Diameter = listing.Wheel.Diameter,
                        Width = listing.Wheel.Width,
                        Offset = listing.Wheel.Offset,
                        BoltPattern = listing.Wheel.BoltPattern,
                        Material = listing.Wheel.Material,
                        Colour = listing.Wheel.Colour,
                        CompatibleMake = listing.Wheel.CompatibleMake,
                        CompatibleModel = listing.Wheel.CompatibleModel,
                        CompatibleYearFrom = listing.Wheel.CompatibleYearFrom,
                        CompatibleYearTo = listing.Wheel.CompatibleYearTo,
                        Quantity = listing.Wheel.Quantity
                    },

                Images = listing.Images
                    .OrderBy(image => image.DisplayOrder)
                    .Select(image => new GetListingImagesResponse
                    {
                        Id = image.Id,
                        Url = image.Url,
                        DisplayOrder = image.DisplayOrder,
                        IsPrimary = image.IsPrimary
                    })
                    .ToList(),

                Documents = listing.Documents
                    .OrderBy(document => document.CreatedAt)
                    .Select(document => new GetListingDocumentsResponse
                    {
                        Id = document.Id,
                        Name = document.Name,
                        Type = document.Type,
                        Url = document.Url,
                        CreatedAt = document.CreatedAt
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}