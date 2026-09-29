namespace NtkstmsAutoMarket.Application.Features.Listings.SetPrimaryListingImage;

public record SetPrimaryListingImageCommand(
    Guid ListingId,
    Guid ImageId);