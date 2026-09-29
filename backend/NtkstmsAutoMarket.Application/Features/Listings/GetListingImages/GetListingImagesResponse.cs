namespace NtkstmsAutoMarket.Application.Features.Listings.GetListingImages;

public class GetListingImagesResponse
{
    public Guid Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsPrimary { get; set; }
}