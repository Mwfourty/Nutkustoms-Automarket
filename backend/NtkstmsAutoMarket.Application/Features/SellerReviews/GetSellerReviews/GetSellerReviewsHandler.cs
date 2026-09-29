using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;

public class GetSellerReviewsHandler
{
    private readonly IApplicationDbContext _context;

    public GetSellerReviewsHandler(
        IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetSellerReviewsResult> Handle(
        GetSellerReviewsQuery query,
        CancellationToken cancellationToken = default)
    {
        if (query.Page < 1)
        {
            throw new ArgumentException(
                "Page must be greater than zero.");
        }

        if (query.PageSize < 1 || query.PageSize > 100)
        {
            throw new ArgumentException(
                "Page size must be between 1 and 100.");
        }

        var sellerExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == query.SellerId &&
                     x.IsActive,
                cancellationToken);

        if (!sellerExists)
        {
            throw new KeyNotFoundException(
                "Seller does not exist.");
        }

        var reviewsQuery = _context.SellerReviews
            .AsNoTracking()
            .Where(x => x.SellerId == query.SellerId);

        var totalCount = await reviewsQuery.CountAsync(
            cancellationToken);

        var items = await reviewsQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new GetSellerReviewsResponse
            {
                Id = x.Id,
                Rating = x.Rating,
                Comment = x.Comment,
                CreatedAt = x.CreatedAt,

                ListingId = x.ListingId,
                ListingTitle = x.Listing.Title,

                ReviewerId = x.ReviewerId,
                ReviewerUsername = x.Reviewer.Username,
                ReviewerProfileImageUrl =
                    x.Reviewer.ProfileImageUrl
            })
            .ToListAsync(cancellationToken);

        return new GetSellerReviewsResult
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
