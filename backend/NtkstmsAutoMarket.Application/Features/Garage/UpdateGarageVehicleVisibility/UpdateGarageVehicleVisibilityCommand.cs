namespace NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicleVisibility;

public record UpdateGarageVehicleVisibilityCommand(
    Guid GarageVehicleId,
    bool IsPublic);
