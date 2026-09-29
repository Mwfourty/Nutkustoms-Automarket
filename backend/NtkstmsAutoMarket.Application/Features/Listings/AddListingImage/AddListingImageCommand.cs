namespace NtkstmsAutoMarket.Application.Features.Listings.AddListingImage;

public record AddListingImageCommand(
	Guid ListingId,
	string Url,
	int DisplayOrder,
	bool IsPrimary);