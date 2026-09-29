using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class SellerReview : BaseEntity
{
    public Guid SellerId { get; private set; }

    public Guid ReviewerId { get; private set; }

    public Guid ListingId { get; private set; }

    public int Rating { get; private set; }

    public string? Comment { get; private set; }

    public User Seller { get; private set; } = null!;

    public User Reviewer { get; private set; } = null!;

    public Listing Listing { get; private set; } = null!;

    private SellerReview()
    {
    }

    public SellerReview(
        Guid sellerId,
        Guid reviewerId,
        Guid listingId,
        int rating,
        string? comment)
    {
        if (sellerId == reviewerId)
        {
            throw new InvalidOperationException(
                "You cannot review yourself.");
        }

        ValidateRating(rating);

        if (comment?.Length > 1000)
        {
            throw new ArgumentException(
                "Review comment cannot exceed 1000 characters.");
        }

        SellerId = sellerId;
        ReviewerId = reviewerId;
        ListingId = listingId;
        Rating = rating;

        Comment = string.IsNullOrWhiteSpace(comment)
            ? null
            : comment.Trim();
    }

    public void Update(
        int rating,
        string? comment)
    {
        ValidateRating(rating);

        if (comment?.Length > 1000)
        {
            throw new ArgumentException(
                "Review comment cannot exceed 1000 characters.");
        }

        Rating = rating;

        Comment = string.IsNullOrWhiteSpace(comment)
            ? null
            : comment.Trim();

        MarkAsUpdated();
    }

    private static void ValidateRating(int rating)
    {
        if (rating < 1 || rating > 5)
        {
            throw new ArgumentException(
                "Rating must be between 1 and 5.");
        }
    }
}
