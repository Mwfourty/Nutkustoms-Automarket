namespace NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

public record UpdateSellerReviewCommand(
    Guid ReviewId,
    Guid SellerId,
    int Rating,
    string? Comment);
