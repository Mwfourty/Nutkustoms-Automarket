namespace NtkstmsAutoMarket.Application.Features.Listings.DeleteListingImage;

public record DeleteListingImageCommand(
    Guid ListingId,
    Guid ImageId);