namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public record WheelDto(
    string? Brand,
    string? Model,
    decimal Diameter,
    decimal Width,
    int? Offset,
    string? BoltPattern,
    string? Material,
    string? Colour,
    string? CompatibleMake,
    string? CompatibleModel,
    int? CompatibleYearFrom,
    int? CompatibleYearTo,
    int Quantity);