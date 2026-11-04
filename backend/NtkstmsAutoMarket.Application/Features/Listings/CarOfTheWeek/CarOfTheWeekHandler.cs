using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.CarOfTheWeek;

public class CarOfTheWeekHandler
{
    private const int MaxMods = 4;

    private readonly IApplicationDbContext _context;

    public CarOfTheWeekHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    private record Candidate(bool IsListing, Guid Id, int Likes);

    /// <summary>
    /// The most liked car wins. A car is either an active vehicle listing
    /// (saves, plus likes on the garage car it came from) or a public garage
    /// car that is not currently listed. Returns null until something is liked.
    /// </summary>
    public async Task<CarOfTheWeekResponse?> Handle(
        CancellationToken cancellationToken)
    {
        var listingIds = await _context.Listings
            .AsNoTracking()
            .Where(listing =>
                listing.Status == ListingStatus.Active &&
                listing.Type == ListingType.Vehicle &&
                listing.Seller.IsActive)
            .Select(listing => listing.Id)
            .ToListAsync(cancellationToken);

        var listingLikes = await ListingLikeCounts.Load(
            _context,
            listingIds,
            cancellationToken);

        var activelyListedVehicles = _context.Listings
            .Where(listing =>
                listing.Status == ListingStatus.Active &&
                listing.SourceGarageVehicleId != null)
            .Select(listing => listing.SourceGarageVehicleId!.Value);

        var garageLikes = await _context.GarageVehicleLikes
            .AsNoTracking()
            .Where(like =>
                like.GarageVehicle.IsPublic &&
                like.GarageVehicle.Owner.IsActive &&
                !activelyListedVehicles.Contains(like.GarageVehicleId))
            .GroupBy(like => like.GarageVehicleId)
            .Select(group => new { Id = group.Key, Likes = group.Count() })
            .ToListAsync(cancellationToken);

        var winner = listingLikes
            .Select(pair => new Candidate(true, pair.Key, pair.Value))
            .Concat(garageLikes.Select(g =>
                new Candidate(false, g.Id, g.Likes)))
            .Where(candidate => candidate.Likes > 0)
            .OrderByDescending(candidate => candidate.Likes)
            .ThenByDescending(candidate => candidate.IsListing)
            .FirstOrDefault();

        if (winner is null)
            return null;

        return winner.IsListing
            ? await LoadListing(winner, cancellationToken)
            : await LoadGarageVehicle(winner, cancellationToken);
    }

    private async Task<CarOfTheWeekResponse?> LoadListing(
        Candidate winner,
        CancellationToken cancellationToken)
    {
        var listing = await _context.Listings
            .AsNoTracking()
            .Where(x => x.Id == winner.Id)
            .Select(x => new CarOfTheWeekResponse
            {
                Kind = "listing",
                Id = x.Id,
                GarageVehicleId = x.SourceGarageVehicleId,
                Title = x.Title,
                Year = x.Vehicle!.Year,
                Mileage = x.Vehicle.Mileage,
                Transmission = x.Vehicle.Transmission,
                Price = x.Price,
                ImageUrl = x.Images
                    .OrderByDescending(image => image.IsPrimary)
                    .ThenBy(image => image.DisplayOrder)
                    .Select(image => image.Url)
                    .FirstOrDefault(),
                OwnerId = x.SellerId,
                OwnerUsername = x.Seller.Username,
                OwnerName = x.Seller.FirstName + " " + x.Seller.LastName,
                OwnerProfileImageUrl = x.Seller.ProfileImageUrl,
                OwnerRating = _context.SellerReviews
                    .Where(review => review.SellerId == x.SellerId)
                    .Select(review => (double?)review.Rating)
                    .Average() ?? 0,
                OwnerReviewCount = _context.SellerReviews
                    .Count(review => review.SellerId == x.SellerId)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (listing is null)
            return null;

        listing.LikeCount = winner.Likes;

        if (listing.GarageVehicleId.HasValue)
        {
            listing.Mods = await LoadMods(
                listing.GarageVehicleId.Value,
                cancellationToken);
        }

        return listing;
    }

    private async Task<CarOfTheWeekResponse?> LoadGarageVehicle(
        Candidate winner,
        CancellationToken cancellationToken)
    {
        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .Where(x => x.Id == winner.Id)
            .Select(x => new CarOfTheWeekResponse
            {
                Kind = "garage",
                Id = x.Id,
                GarageVehicleId = x.Id,
                Title = x.Make + " " + x.Model,
                Year = x.Year,
                Mileage = x.Mileage,
                Transmission = x.Transmission,
                ImageUrl = _context.GarageVehicleImages
                    .Where(image => image.GarageVehicleId == x.Id)
                    .OrderByDescending(image => image.IsPrimary)
                    .ThenBy(image => image.DisplayOrder)
                    .Select(image => image.Url)
                    .FirstOrDefault(),
                OwnerId = x.OwnerId,
                OwnerUsername = x.Owner.Username,
                OwnerName = x.Owner.FirstName + " " + x.Owner.LastName,
                OwnerProfileImageUrl = x.Owner.ProfileImageUrl,
                OwnerRating = _context.SellerReviews
                    .Where(review => review.SellerId == x.OwnerId)
                    .Select(review => (double?)review.Rating)
                    .Average() ?? 0,
                OwnerReviewCount = _context.SellerReviews
                    .Count(review => review.SellerId == x.OwnerId)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (vehicle is null)
            return null;

        vehicle.LikeCount = winner.Likes;
        vehicle.Mods = await LoadMods(winner.Id, cancellationToken);

        return vehicle;
    }

    private async Task<List<string>> LoadMods(
        Guid garageVehicleId,
        CancellationToken cancellationToken)
    {
        return await _context.GarageModifications
            .AsNoTracking()
            .Where(mod => mod.GarageVehicleId == garageVehicleId)
            .OrderByDescending(mod => mod.CreatedAt)
            .Select(mod => mod.Name)
            .Take(MaxMods)
            .ToListAsync(cancellationToken);
    }
}

public class CarOfTheWeekResponse
{
    /// <summary>"listing" or "garage".</summary>
    public string Kind { get; set; } = string.Empty;

    /// <summary>The listing id for listings, otherwise the garage vehicle id.</summary>
    public Guid Id { get; set; }

    public Guid? GarageVehicleId { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Year { get; set; }

    public int Mileage { get; set; }

    public string? Transmission { get; set; }

    public decimal? Price { get; set; }

    public string? ImageUrl { get; set; }

    public int LikeCount { get; set; }

    public List<string> Mods { get; set; } = new();

    public Guid OwnerId { get; set; }

    public string OwnerUsername { get; set; } = string.Empty;

    public string OwnerName { get; set; } = string.Empty;

    public string? OwnerProfileImageUrl { get; set; }

    public double OwnerRating { get; set; }

    public int OwnerReviewCount { get; set; }
}
