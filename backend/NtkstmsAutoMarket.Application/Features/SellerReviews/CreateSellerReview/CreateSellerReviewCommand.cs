namespace NtkstmsAutoMarket.Application.Features.SellerReviews.CreateSellerReview;

public record CreateSellerReviewCommand(
    Guid SellerId,
    Guid ListingId,
    int Rating,
    string? Comment);
