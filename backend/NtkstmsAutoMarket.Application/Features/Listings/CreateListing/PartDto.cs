namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public record PartDto(
    string Name,
    string? PartNumber,
    string? Description,
    string? Manufacturer,
    string? CompatibleMake,
    string? CompatibleModel,
    int? CompatibleYearFrom,
    int? CompatibleYearTo,
    string? Condition
);