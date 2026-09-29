namespace NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

public record UpdateSellerReviewResult(
    Guid ReviewId,
    Guid SellerId,
    Guid ReviewerId,
    Guid ListingId,
    int Rating,
    string? Comment);
