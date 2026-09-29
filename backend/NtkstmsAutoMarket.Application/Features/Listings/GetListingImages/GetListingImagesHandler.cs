using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListingImages;

public class GetListingImagesHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetListingImagesHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetListingImagesResponse>> Handle(
        GetListingImagesQuery query,
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

        return await _context.ListingImages
            .AsNoTracking()
            .Where(image => image.ListingId == query.ListingId)
            .OrderBy(image => image.DisplayOrder)
            .Select(image => new GetListingImagesResponse
            {
                Id = image.Id,
                Url = image.Url,
                DisplayOrder = image.DisplayOrder,
                IsPrimary = image.IsPrimary
            })
            .ToListAsync(cancellationToken);
    }
}