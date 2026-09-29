namespace NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;

public record GetSellerReviewsQuery(
    Guid SellerId,
    int Page = 1,
    int PageSize = 10);
