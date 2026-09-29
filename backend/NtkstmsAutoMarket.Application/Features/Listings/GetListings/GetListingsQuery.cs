using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public record GetListingsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    ListingType? Type = null,
    ListingCondition? Condition = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? Location = null,
    string? SortBy = null,
    string? SortDirection = null);