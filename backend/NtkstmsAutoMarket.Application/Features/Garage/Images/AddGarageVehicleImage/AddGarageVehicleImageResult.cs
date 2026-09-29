namespace NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;

public record AddGarageVehicleImageResult(
    Guid Id,
    Guid GarageVehicleId,
    string Url,
    int DisplayOrder,
    bool IsPrimary,
    DateTime CreatedAt);
