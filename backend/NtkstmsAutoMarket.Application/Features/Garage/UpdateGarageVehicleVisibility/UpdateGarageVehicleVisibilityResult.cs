namespace NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicleVisibility;

public record UpdateGarageVehicleVisibilityResult(
    Guid Id,
    bool IsPublic,
    DateTime? UpdatedAt);
