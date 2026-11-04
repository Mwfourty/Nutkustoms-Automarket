using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class GetListingsHandler
{
    private readonly IApplicationDbContext _context;

    public GetListingsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetListingsResult> Handle(
        GetListingsQuery query,
        CancellationToken cancellationToken)
    {
        if (query.Page < 1)
            throw new ArgumentException(
                "Page must be greater than zero.");

        if (query.PageSize < 1 || query.PageSize > 100)
            throw new ArgumentException(
                "Page size must be between 1 and 100.");

        var listingsQuery = _context.Listings
            .AsNoTracking()
            .Where(listing =>
                listing.Status == ListingStatus.Active);

        if (query.SellerId.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.SellerId == query.SellerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();

            listingsQuery = listingsQuery.Where(listing =>
                listing.Title.ToLower().Contains(search) ||
                listing.Description.ToLower().Contains(search));
        }

        if (query.Type.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Type == query.Type.Value);
        }

        if (query.Condition.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Condition == query.Condition.Value);
        }

        if (query.MinPrice.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Price <= query.MaxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Location))
        {
            var location = query.Location.Trim().ToLower();

            listingsQuery = listingsQuery.Where(listing =>
                listing.Location != null &&
                listing.Location.ToLower().Contains(location));
        }

        var sortBy = query.SortBy?.Trim().ToLowerInvariant();
        var sortDirection = query.SortDirection?.Trim().ToLowerInvariant();

        listingsQuery = (sortBy, sortDirection) switch
        {
            ("price", "asc") =>
                listingsQuery.OrderBy(listing => listing.Price),

            ("price", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.Price),

            ("title", "asc") =>
                listingsQuery.OrderBy(listing => listing.Title),

            ("title", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.Title),

            ("createdat", "asc") =>
                listingsQuery.OrderBy(listing => listing.CreatedAt),

            ("createdat", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.CreatedAt),

            _ =>
                listingsQuery.OrderByDescending(listing => listing.CreatedAt)
        };

        var totalCount = await listingsQuery.CountAsync(
            cancellationToken);

        var items = await listingsQuery
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