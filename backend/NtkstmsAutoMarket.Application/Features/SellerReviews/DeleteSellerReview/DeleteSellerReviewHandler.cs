using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.SellerReviews.DeleteSellerReview;

public class DeleteSellerReviewHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteSellerReviewHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        DeleteSellerReviewCommand command,
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
                "You can only delete your own reviews.");
        }

        _context.SellerReviews.Remove(review);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}
