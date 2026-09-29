using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.GetListingDocuments;

public class GetListingDocumentsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetListingDocumentsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetListingDocumentsResponse>> Handle(
        GetListingDocumentsQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserIdOrNull;

        var canViewListing = await _context.Listings
            .AsNoTracking()
            .AnyAsync(
                listing =>
                    listing.Id == query.ListingId &&
                    (
                        listing.Status == ListingStatus.Active ||
                        (
                            currentUserId.HasValue &&
                            listing.SellerId == currentUserId.Value
                        )
                    ),
                cancellationToken);

        if (!canViewListing)
        {
            throw new KeyNotFoundException(
                "Listing does not exist.");
        }

        return await _context.ListingDocuments
            .AsNoTracking()
            .Where(document => document.ListingId == query.ListingId)
            .OrderBy(document => document.CreatedAt)
            .Select(document => new GetListingDocumentsResponse
            {
                Id = document.Id,
                Name = document.Name,
                Type = document.Type,
                Url = document.Url,
                CreatedAt = document.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}