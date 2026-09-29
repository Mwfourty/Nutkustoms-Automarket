using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.PublishListing;

public record PublishListingResult(
    Guid ListingId,
    ListingStatus Status);