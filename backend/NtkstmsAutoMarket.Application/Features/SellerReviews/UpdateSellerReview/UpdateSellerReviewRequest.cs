namespace NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

public record UpdateSellerReviewRequest(
    int Rating,
    string? Comment);
