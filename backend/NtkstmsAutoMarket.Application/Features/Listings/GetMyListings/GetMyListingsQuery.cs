using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetMyListings;

public record GetMyListingsQuery(
    int Page = 1,
    int PageSize = 20,
    ListingStatus? Status = null);
