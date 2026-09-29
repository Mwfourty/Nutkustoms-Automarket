using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;

public record SellGarageVehicleResult(
    Guid ListingId,
    Guid VehicleId,
    Guid SourceGarageVehicleId,
    ListingStatus Status,
    int ImagesCopied);
