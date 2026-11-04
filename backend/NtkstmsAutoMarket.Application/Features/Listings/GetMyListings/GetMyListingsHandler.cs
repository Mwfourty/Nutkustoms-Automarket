using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetMyListings;

public class GetMyListingsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyListingsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetListingsResult> Handle(
        GetMyListingsQuery query,
        CancellationToken cancellationToken = default)
    {
        if (query.Page < 1)
            throw new ArgumentException(
                "Page must be greater than zero.");

        if (query.PageSize < 1 || query.PageSize > 100)
            throw new ArgumentException(
                "Page size must be between 1 and 100.");

        var userId = _currentUser.UserId;

        var listingsQuery = _context.Listings
            .AsNoTracking()
            .Where(listing =>
                listing.SellerId == userId);

        if (query.Status.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Status == query.Status.Value);
        }

        var totalCount = await listingsQuery.CountAsync(
            cancellationToken);

        var items = await listingsQuery
            .OrderByDescending(listing => listing.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ListingProjections.ToResponse)
            .ToListAsync(cancellationToken);

        await ListingLikeCounts.Apply(
            _context,
            items,
            cancellationToken);

        return new GetListingsResult
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(
                totalCount / (double)query.PageSize)
        };
    }
}
