using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;

public record SellGarageVehicleRequest(
    string Title,
    string Description,
    decimal Price,
    ListingCondition Condition,
    string? Location);
