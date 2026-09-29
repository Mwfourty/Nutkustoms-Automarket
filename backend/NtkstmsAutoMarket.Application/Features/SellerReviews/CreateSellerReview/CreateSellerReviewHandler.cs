using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.SellerReviews.CreateSellerReview;

public class CreateSellerReviewHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateSellerReviewHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateSellerReviewResult> Handle(
        CreateSellerReviewCommand command,
        CancellationToken cancellationToken = default)
    {
        var reviewerId = _currentUser.UserId;

        if (reviewerId == command.SellerId)
        {
            throw new InvalidOperationException(
                "You cannot review yourself.");
        }

        var sellerExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == command.SellerId &&
                     x.IsActive,
                cancellationToken);

        if (!sellerExists)
        {
            throw new KeyNotFoundException(
                "Seller does not exist.");
        }

        var listing = await _context.Listings
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == command.ListingId,
                cancellationToken);

        if (listing is null)
        {
            throw new KeyNotFoundException(
                "Listing does not exist.");
        }

        if (listing.SellerId != command.SellerId)
        {
            throw new InvalidOperationException(
                "The listing does not belong to this seller.");
        }

        if (listing.Status != ListingStatus.Sold)
        {
            throw new InvalidOperationException(
                "Only sold listings can be reviewed.");
        }

        var reviewExists = await _context.SellerReviews
            .AnyAsync(
                x => x.ReviewerId == reviewerId &&
                     x.ListingId == command.ListingId,
                cancellationToken);

        if (reviewExists)
        {
            throw new InvalidOperationException(
                "You have already reviewed this listing.");
        }

        var review = new SellerReview(
            command.SellerId,
            reviewerId,
            command.ListingId,
            command.Rating,
            command.Comment);

        _context.SellerReviews.Add(review);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new CreateSellerReviewResult(
            review.Id,
            review.SellerId,
            review.ReviewerId,
            review.ListingId,
            review.Rating,
            review.Comment);
    }
}
