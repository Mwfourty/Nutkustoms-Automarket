using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Application.Features.Listings.GetListingImages;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.GetListingDocuments;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListingById;

public class GetListingByIdResponse
{
    public Guid Id { get; set; }

    public Guid SellerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public ListingType Type { get; set; }

    public ListingCondition Condition { get; set; }

    public ListingStatus Status { get; set; }

    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; }

    public VehicleResponse? Vehicle { get; set; }

    public PartResponse? Part { get; set; }

    public EngineResponse? Engine { get; set; }

    public WheelResponse? Wheel { get; set; }

    public List<GetListingImagesResponse> Images { get; set; } = new();

    public List<GetListingDocumentsResponse> Documents { get; set; } = new();

    public GetPublicProfileResponse Seller { get; set; } = null!;
}