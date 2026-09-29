using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public record CreateListingCommand(
    string Title,
    string Description,
    decimal Price,
    ListingType Type,
    ListingCondition Condition,
    string? Location,
    VehicleDto? Vehicle,
    PartDto? Part,
    EngineDto? Engine,
    WheelDto? Wheel);