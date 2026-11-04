using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public static class ListingLikeCounts
{
    /// <summary>
    /// A listing's likes are the distinct users who saved it, plus users who
    /// liked the garage vehicle it was created from.
    /// </summary>
    public static async Task<Dictionary<Guid, int>> Load(
        IApplicationDbContext context,
        IReadOnlyCollection<Guid> listingIds,
        CancellationToken cancellationToken)
    {
        if (listingIds.Count == 0)
            return new Dictionary<Guid, int>();

        var saves = context.SavedListings
            .Where(saved => listingIds.Contains(saved.ListingId))
            .Select(saved => new { saved.ListingId, saved.UserId });

        var garageLikes =
            from listing in context.Listings
            where listingIds.Contains(listing.Id) &&
                  listing.SourceGarageVehicleId != null
            join like in context.GarageVehicleLikes
                on listing.SourceGarageVehicleId.Value equals like.GarageVehicleId
            select new { ListingId = listing.Id, like.UserId };

        var pairs = await saves
            .Union(garageLikes)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return pairs
            .GroupBy(pair => pair.ListingId)
            .ToDictionary(group => group.Key, group => group.Count());
    }

    public static async Task Apply(
        IApplicationDbContext context,
        IReadOnlyCollection<GetListingsResponse> listings,
        CancellationToken cancellationToken)
    {
        var counts = await Load(
            context,
            listings.Select(listing => listing.Id).ToList(),
            cancellationToken);

        foreach (var listing in listings)
        {
            listing.LikeCount = counts.GetValueOrDefault(listing.Id);
        }

        var sellerIds = listings
            .Select(listing => listing.SellerId)
            .Distinct()
            .ToList();

        var ratings = await context.SellerReviews
            .AsNoTracking()
            .Where(review => sellerIds.Contains(review.SellerId))
            .GroupBy(review => review.SellerId)
            .Select(group => new
            {
                SellerId = group.Key,
                Average = group.Average(review => (double)review.Rating)
            })
            .ToDictionaryAsync(
                x => x.SellerId,
                x => x.Average,
                cancellationToken);

        foreach (var listing in listings)
        {
            listing.SellerRating = ratings.GetValueOrDefault(listing.SellerId);
        }
    }
}
