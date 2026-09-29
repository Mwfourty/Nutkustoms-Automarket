namespace NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;

public class GetSellerReviewsResponse
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid ListingId { get; set; }

    public string ListingTitle { get; set; } = string.Empty;

    public Guid ReviewerId { get; set; }

    public string ReviewerUsername { get; set; } = string.Empty;

    public string? ReviewerProfileImageUrl { get; set; }
}
