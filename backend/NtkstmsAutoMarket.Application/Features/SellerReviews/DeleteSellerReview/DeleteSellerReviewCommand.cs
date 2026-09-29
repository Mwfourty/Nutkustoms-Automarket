namespace NtkstmsAutoMarket.Application.Features.SellerReviews.DeleteSellerReview;

public record DeleteSellerReviewCommand(
    Guid SellerId,
    Guid ReviewId);
