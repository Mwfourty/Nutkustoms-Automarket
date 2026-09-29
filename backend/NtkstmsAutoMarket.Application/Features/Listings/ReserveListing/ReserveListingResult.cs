using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.ReserveListing;

public record ReserveListingResult(
    Guid ListingId,
    ListingStatus Status);