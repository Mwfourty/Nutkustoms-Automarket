using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;

public record SellGarageVehicleCommand(
    Guid GarageVehicleId,
    string Title,
    string Description,
    decimal Price,
    ListingCondition Condition,
    string? Location);
