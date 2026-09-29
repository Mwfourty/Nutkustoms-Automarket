using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

public class UpdateSellerReviewHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateSellerReviewHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateSellerReviewResult> Handle(
        UpdateSellerReviewCommand command,
        CancellationToken cancellationToken = default)
    {
        var reviewerId = _currentUser.UserId;

        var review = await _context.SellerReviews
            .FirstOrDefaultAsync(
                x => x.Id == command.ReviewId &&
                     x.SellerId == command.SellerId,
                cancellationToken);

        if (review is null)
        {
            throw new KeyNotFoundException(
                "Review does not exist.");
        }

        if (review.ReviewerId != reviewerId)
        {
            throw new ForbiddenException(
                "You can only edit your own reviews.");
        }

        review.Update(
            command.Rating,
            command.Comment);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateSellerReviewResult(
            review.Id,
            review.SellerId,
            review.ReviewerId,
            review.ListingId,
            review.Rating,
            review.Comment);
    }
}
