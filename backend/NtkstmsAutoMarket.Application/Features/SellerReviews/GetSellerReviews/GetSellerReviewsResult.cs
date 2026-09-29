namespace NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;

public class GetSellerReviewsResult
{
    public List<GetSellerReviewsResponse> Items { get; set; } = new();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public int TotalPages { get; set; }
}
