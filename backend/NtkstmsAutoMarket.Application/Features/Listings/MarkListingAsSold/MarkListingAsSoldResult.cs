using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.MarkListingAsSold;

public record MarkListingAsSoldResult(
    Guid ListingId,
    ListingStatus Status);