namespace NtkstmsAutoMarket.Application.Features.SellerReviews.CreateSellerReview;

public record CreateSellerReviewResult(
    Guid ReviewId,
    Guid SellerId,
    Guid ReviewerId,
    Guid ListingId,
    int Rating,
    string? Comment);
