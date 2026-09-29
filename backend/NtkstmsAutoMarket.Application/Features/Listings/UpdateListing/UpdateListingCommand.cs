using NtkstmsAutoMarket.Domain.Enums;
using NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

namespace NtkstmsAutoMarket.Application.Features.Listings.UpdateListing;

public record UpdateListingCommand(
    Guid ListingId,
    string Title,
    string Description,
    decimal Price,
    ListingCondition Condition,
    string? Location,
    VehicleDto? Vehicle,
    PartDto? Part,
    EngineDto? Engine,
    WheelDto? Wheel);